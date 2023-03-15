import React, { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import supabase from "../lib/api/supabase_client";
import GroceriesScreen from "../lib/components/screens/GroceriesScreen";
import NotificationsScreen from "../lib/components/screens/NotificationsScreen";
import TodoScreen from "../lib/components/screens/TodoScreen";

function Home() {
  const [todosClicked, setTodosClicked] = useState(true);
  const [notificationsClicked, setNotificationsClicked] = useState(false);
  const [groceriesClicked, setGroceriesClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState(null);

  const Store = require("electron-store");
  const store = new Store();

  useEffect(() => {
    if (store.get("user") == undefined || null) {
      getUser();

      if (!userStatus) {
        store.set("user", "Jorene");
      } else {
        store.set("user", "Jay");
      }
    }
    // store.delete("user")
  }, []);

  console.log(store.get("user"));

  const getUser = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("User")
        .select("active")
        .eq("user", "Jay");

      if (data) {
        setUserStatus(data[0].active);
      }
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClicked = (index: number) => {
    if (index === 0) {
      setTodosClicked(true);
      setNotificationsClicked(false);
      setGroceriesClicked(false);
    } else if (index === 1) {
      setTodosClicked(false);
      setNotificationsClicked(false);
      setGroceriesClicked(true);
    } else if (index === 2) {
      setTodosClicked(false);
      setNotificationsClicked(true);
      setGroceriesClicked(false);
    }
  };

  const whichPage = () => {
    if (todosClicked) {
      return <TodoScreen />;
    }
    if (groceriesClicked) {
      return <GroceriesScreen />;
    }
    if (notificationsClicked) {
      return <NotificationsScreen />;
    }
  };

  if (loading) {
    return (
      <React.Fragment>
        <div className="pb-32 min-h-screen flex items-center justify-center">
          <MoonLoader color="#672ee3" size={60} />
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className="font-golos flex flex-col relative">
          <div className="flex w-full gap-10 text-gray-500 py-5 text-xl">
            <div className="absolute border-gray-100 border w-full top-[4.25rem]" />
            <div
              onClick={() => handleClicked(0)}
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
              onClick={() => handleClicked(1)}
              className="flex flex-col hover:cursor-pointer"
            >
              <div>Groceries</div>
              {groceriesClicked ? (
                <div className="w-full border-[1px] border-purpleAccent z-10 mt-5" />
              ) : (
                <div></div>
              )}
            </div>

            <div
              onClick={() => handleClicked(2)}
              className="flex flex-col hover:cursor-pointer"
            >
              <div>Notifications</div>
              {notificationsClicked ? (
                <div className="w-full border-[1px] border-purpleAccent z-10 mt-5" />
              ) : (
                <div></div>
              )}
            </div>
          </div>

          {whichPage()}
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
