"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "../../components/chat";
import WeatherWidget from "../../components/weather-widget";
import FileViewer from "../../components/file-viewer";
import { searchHay } from "@/app/utils/searchHay";
import { generateWompiLink } from "@/app/utils/wompi";

const FunctionCalling = () => {
  const [weatherData, setWeatherData] = useState({});

  const functionCallHandler = async (call) => {
    const args = JSON.parse(call.function.arguments);
    console.log('call.function: ', call.function);
    console.log('args: ', args);
    
    if (call.function.name === 'searchHay') {
      const data = await searchHay();
      return JSON.stringify(data);
    }
    
    if (call.function.name === 'generateWompiLink') {
      const paymentLink = await generateWompiLink(args.amount);
      return JSON.stringify({ paymentLink });
    }
    
    return JSON.stringify({});
  };

  // return (
  //   <main className={styles.main}>
  //     <div className={styles.container}>
  //       <div className={styles.fileViewer}>
  //         <FileViewer />
  //       </div>
  //       <div className={styles.chatContainer}>
  //         <div className={styles.weatherWidget}>
  //           <div className={styles.weatherContainer}>
  //             <WeatherWidget {...weatherData} />
  //           </div>
  //         </div>
  //         <div className={styles.chat}>
  //           <Chat functionCallHandler={functionCallHandler} />
  //         </div>
  //       </div>
  //     </div>
  //   </main>
  // );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
          {/* <WeatherWidget {...weatherData} /> */}
          <FileViewer />
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;
