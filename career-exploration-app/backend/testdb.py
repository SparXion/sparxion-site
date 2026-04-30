from pymongo import MongoClient
from config import MONGO_URI
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["career-exploration"]
print("Students:", db["students"].find_one({"id": "student001"}))
print("Careers:", db["careers"].find_one({"name": "Toy Designer"}))
print("Companies:", db["companies"].find_one({"name": "Hasbro"}))