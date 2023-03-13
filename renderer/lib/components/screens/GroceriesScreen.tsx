import React, { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import supabase from "../../api/supabase_client";
import GrocerieItem from "../GrocerieItem";

export default function GroceriesScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Groceries")
        .select()
        .order("completed", { ascending: true });

      if (data) {
        setList(data);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setList([{ title: e.target.value, completed: false }, ...list]);
      e.target.value = "";
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Groceries")
        .delete()
        .eq("title", list[index].title);

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      loadTodos();
    }
  };

  const handleInsertGroceries = async () => {
    try {
      setLoading(true);

      for (const item of list) {
        const { data, error } = await supabase
          .from("Groceries")
          .select("*")
          .eq("title", item.title);

        if (data && data.length === 0) {
          const { data, error } = await supabase
            .from("Groceries")
            .insert([{ title: item.title, completed: item.completed }]);

          if (error) throw error;
        }

        if (error) throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
      loadTodos();
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
      <div className="px-5">
        <input
          autoFocus
          placeholder="Grocerie item here..."
          className="w-full placeholder:text-xl text-xl text-gray-500 focus:border-none focus:outline-none mt-0"
          onKeyDown={handleKeyDown}
        />

        <div className="border border-gray-100 my-4 mx-0" />
        <div className="mt-3">
          {list.map((item, index) => {
            return (
              <div key={index} className="relative">
                <div>
                  <GrocerieItem title={item.title}>
                    <div
                      onClick={() => handleDeleteItem(index)}
                      className="hover:cursor-pointer"
                    >
                      <img
                        src="../images/trashIcon.png"
                        alt=""
                        className="h-7 w-7"
                      />
                    </div>
                  </GrocerieItem>
                  <div className="border border-gray-100 my-4 mx-0" />
                </div>
              </div>
            );
          })}
        </div>
        <div
          onClick={() => handleInsertGroceries()}
          className="absolute top-5 right-5 hover:cursor-pointer"
        >
          <img src="/images/uploadIcon.png" alt="" className="h-7 w-7" />
        </div>
      </div>
    );
  }
}
