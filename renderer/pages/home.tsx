import Head from "next/head";
import React, { useState } from "react";
import NotificationsScreen from "../lib/components/screens/NotificationsScreen";
import TodoScreen from "../lib/components/screens/TodoScreen";

function Home() {
  const [todosClicked, setTodosClicked] = useState(true);

  const handleTodosClick = () => {
    setTodosClicked(true);
  };

  const handleNotificationsClick = () => {
    setTodosClicked(false);
  };
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>

      <div className="font-golos flex flex-col relative">
        <div className="flex w-full gap-10 text-gray-500 py-5 text-xl">
          <div className="absolute border-gray-100 border w-full top-[4.25rem]" />
          <div
            onClick={() => handleTodosClick()}
            className="flex flex-col hover:cursor-pointer pl-5"
          >
            <div>Todo</div>
            {todosClicked ? (
              <div className="w-full border-[1px] border-purpleAccent z-10 mt-5" />
            ) : (
              <div></div>
            )}
          </div>

          <div
            onClick={() => handleNotificationsClick()}
            className="flex flex-col hover:cursor-pointer"
          >
            <div>Notifications</div>
            {!todosClicked ? (
              <div className="w-full border-[1px] border-purpleAccent z-10 mt-5" />
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {todosClicked ? <TodoScreen /> : <NotificationsScreen />}
      </div>
    </React.Fragment>
  );
}

export default Home;
