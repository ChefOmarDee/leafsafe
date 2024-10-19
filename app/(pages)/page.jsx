import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import plantImage from "./plant.jpg";

const Home = () => {
  return (
    <div className="relative min-h-screen">
      <Image
        src={plantImage}
        alt="Plant background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <Head>
          <title>Safeleaf: AI-Powered Plant Safety Assistant</title>
          <meta
            name="description"
            content="Safeleaf: Your AI-powered companion for plant identification and safety"
          />
        </Head>
        <main className="text-center p-8 rounded-lg max-w-2xl md:bg-transparent bg-black bg-opacity-75">
          <h1 className="text-4xl font-bold mb-6 text-green-300">
            Welcome to Safeleaf
          </h1>
          <p className="text-xl mb-6 text-white md:text-black">
            SafeLeaf is an AI-powered web app that helps users identify plants
            as edible, inedible, or poisonous using image recognition. It offers
            immediate advice on treating symptoms from harmful plants and
            provides a rich plant database as well as a community of nature
            enthusiasts for safe exploration of the great outdoors.
          </p>
          <Link
            href="/detectplant"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Start Exploring
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
