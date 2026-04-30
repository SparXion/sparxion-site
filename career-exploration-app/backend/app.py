from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from config import MONGO_URI, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
from bson import json_util
import boto3
import uuid
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["career-exploration"]
s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name='us-east-1')
BUCKET_NAME = 'career-exploration-sketches-jv'

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logging.getLogger('pymongo').setLevel(logging.WARNING)  # Reduce pymongo verbosity

@app.route('/')
def index():
    return "Career Exploration App Backend"

@app.route('/students', methods=['GET'])
def get_students():
    try:
        students = db["students"].find()
        return jsonify(json_util.dumps(list(students)))
    except Exception as e:
        logger.error(f"Error fetching students: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/students', methods=['POST'])
def add_student():
    try:
        data = request.form
        logger.debug(f"Received student data: {data}")
        if not data.get("id"):
            logger.warning("Missing student ID")
            return jsonify({"error": "Student ID is required"}), 400
        if db["students"].find_one({"id": data.get("id")}):
            logger.warning(f"Student ID {data.get('id')} already exists")
            return jsonify({"error": "Student ID already exists"}), 400
        images = []
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
                logger.debug(f"Uploading image: {filename}")
                s3.upload_fileobj(file, BUCKET_NAME, filename, ExtraArgs={'ContentType': file.content_type})
                image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"
                images = [{"url": image_url, "tags": ["sketch"]}]
        student = {
            "id": data.get("id"),
            "interests": [i.strip() for i in data.get("interests", "").split(',')] if data.get("interests") else [],
            "talents": [t.strip() for t in data.get("talents", "").split(',')] if data.get("talents") else [],
            "images": images
        }
        db["students"].insert_one(student)
        logger.info(f"Student {data.get('id')} added successfully")
        return jsonify(json_util.dumps(student)), 201
    except Exception as e:
        logger.error(f"Error adding student: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    try:
        data = request.form
        logger.debug(f"Updating student {student_id} with data: {data}")
        update_data = {}
        if data.get("interests"):
            update_data["interests"] = [i.strip() for i in data.get("interests").split(',')]
        if data.get("talents"):
            update_data["talents"] = [t.strip() for t in data.get("talents").split(',')]
        images = []
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
                logger.debug(f"Uploading image for update: {filename}")
                s3.upload_fileobj(file, BUCKET_NAME, filename, ExtraArgs={'ContentType': file.content_type})
                image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"
                images = [{"url": image_url, "tags": ["sketch"]}]
                update_data["images"] = images
        if not update_data:
            logger.warning("No data provided to update")
            return jsonify({"error": "No data provided to update"}), 400
        result = db["students"].update_one({"id": student_id}, {"$set": update_data})
        if result.matched_count == 0:
            logger.warning(f"Student {student_id} not found")
            return jsonify({"error": "Student not found"}), 404
        logger.info(f"Student {student_id} updated successfully")
        return jsonify({"message": "Student updated"}), 200
    except Exception as e:
        logger.error(f"Error updating student: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        result = db["students"].delete_one({"id": student_id})
        if result.deleted_count == 0:
            logger.warning(f"Student {student_id} not found")
            return jsonify({"error": "Student not found"}), 404
        logger.info(f"Student {student_id} deleted successfully")
        return jsonify({"message": "Student deleted"}), 200
    except Exception as e:
        logger.error(f"Error deleting student: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/careers', methods=['GET'])
def get_careers():
    try:
        careers = db["careers"].find()
        return jsonify(json_util.dumps(list(careers)))
    except Exception as e:
        logger.error(f"Error fetching careers: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/companies', methods=['GET', 'POST'])
def companies():
    try:
        if request.method == 'GET':
            companies = db["companies"].find()
            return jsonify(json_util.dumps(list(companies)))
        elif request.method == 'POST':
            data = request.form
            logger.debug(f"Received company data: {data}")
            if db["companies"].find_one({"name": data.get("name")}):
                logger.warning(f"Company {data.get('name')} already exists")
                return jsonify({"error": "Company name already exists"}), 400
            images = []
            if 'image' in request.files:
                file = request.files['image']
                if file and file.filename:
                    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
                    logger.debug(f"Uploading image: {filename}")
                    s3.upload_fileobj(file, BUCKET_NAME, filename, ExtraArgs={'ContentType': file.content_type})
                    image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"
                    images = [{"url": image_url, "tags": ["image"]}]
            company = {
                "name": data.get("name"),
                "needs": [n.strip() for n in data.get("needs", "").split(',')] if data.get("needs") else [],
                "industry": data.get("industry", ""),
                "images": images
            }
            db["companies"].insert_one(company)
            logger.info(f"Company {data.get('name')} added successfully")
            return jsonify(json_util.dumps(company)), 201
    except Exception as e:
        logger.error(f"Error processing companies: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)