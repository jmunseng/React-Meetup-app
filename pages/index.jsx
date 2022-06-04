import React, { useEffect, useState } from "react";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";

const HomePage = (props) => {
  const [loadedMeetups, setLoadedMeetups] = useState([]);

  useEffect(() => {
    setLoadedMeetups(props.meetups);
  }, [loadedMeetups]);

  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Brows a huge list of highly active React Meetups"
        />
      </Head>
      <MeetupList meetups={loadedMeetups} />
    </>
  );
};

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   //fetch data from api
//   return {
//     props: { meetups: DUMMY_MEETUPS },
//   };
// }
// client side

export async function getStaticProps() {
  //在程序运行之前 先链接到数据库, 获取数据发送到 index的props中
  //fetch data from api
  const client = await MongoClient.connect(
    "mongodb+srv://mun:munseng12@cluster0.ertew.mongodb.net/?retryWrites=true&w=majority"
  ); //链接MongoDB//从mongodb中获取url
  const db = client.db(); // 访问获取db

  const meetupsCollection = db.collection("meetups"); //collection就是table /选择数据文件夹

  const meetups = await meetupsCollection.find().toArray(); //把所有document 转换为array
  client.close();

  return {
    props: {
      meetups: meetups.map((e) => ({
        title: e.title,
        address: e.address,
        image: e.image,
        id: e._id.toString(),
      })), // 这个状态下, 只会第一次build 的时候拉数据, 之后不在更新后添加的数据, 因此需要revalidate
    },
    revalidate: 1, //每1秒 确认数据更新// 如果有变化 会re-pre-generate
  };
}

export default HomePage;
//server side rendering, nextjs, file base routing, SEO,
//Vercal server
