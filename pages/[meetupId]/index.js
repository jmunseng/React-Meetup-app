import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        id={props.meetupData.image}
        title={props.meetupData.title}
        image={props.meetupData.image}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
}

export async function getStaticPaths() {
  // 决定哪一个页面需要pre-generate

  //fetch data from api
  const client = await MongoClient.connect(
    "mongodb+srv://mun:munseng12@cluster0.ertew.mongodb.net/?retryWrites=true&w=majority"
  ); //链接MongoDB//从mongodb中获取url
  const db = client.db(); // 访问获取db

  const meetupsCollection = db.collection("meetups"); //collection就是table /选择数据文件夹

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: false, //false的意思是 包括所有meetupId的values// 这时如果有m3 id的网页 就会出现404页面
    paths: meetups.map((e) => ({ params: { meetupId: e._id.toString() } })), //URL 部分
  };
}

export async function getStaticProps(context) {
  //fetch data for a single meetup
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://mun:munseng12@cluster0.ertew.mongodb.net/?retryWrites=true&w=majority"
  ); //链接MongoDB//从mongodb中获取url
  const db = client.db(); // 访问获取db

  const meetupsCollection = db.collection("meetups"); //collection就是table /选择数据文件夹
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });
  console.log(selectedMeetup);
  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
      },
    },
  };
}
export default MeetupDetails;
