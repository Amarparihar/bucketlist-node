// 


const jwt = require("jsonwebtoken");

const { MongoClient, ObjectID } = require("mongodb");
const URL = process.env.dbURL;
const DB = "myDB";

 function authorized(req, res, next) {
  if (req.headers.authorization) {
     jwt.verify(req.headers.authorization , process.env.JWT_KEY , async(err , decoded)=>{
         if(decoded !== undefined){
             let userId = await getById(decoded.user_id);
             if(decoded.user_id == userId){
                console.log(decoded);
                next();

             }else{
                 res.status(401).json({message:'unAuthorized'})
             }
            
         }else{
             res.sendStatus(403);
         }
     });
   
  } else {
    res.status(401).json({ message: "No token passed" });
  }
}

async function getById(id) {
  try {
    let client = await MongoClient.connect(URL);
    let db = client.db(DB);
    let data = await db.collection("users").findOne({ _id: ObjectID(id) });
    let user_id = data._id;
    return user_id;
  } catch (error) {
    console.log(error);
  }
}

module.exports = authorized;
