import { MongoClient } from "mongodb";
// /api/new-meetup
//POST /api/new-meetup

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      "mongodb+srv://mun:munseng12@cluster0.ertew.mongodb.net/?retryWrites=true&w=majority"
    ); //链接MongoDB//从mongodb中获取url
    const db = client.db(); // 访问获取db

    const meetupsCollection = db.collection("meetups"); //collection就是table /选择数据文件夹

    const result = await meetupsCollection.insertOne(data); //储存数据
    console.log(result);

    client.close(); //关闭数据库

    res.status(201).json({ message: "meetup inserted!" });
  }
}
