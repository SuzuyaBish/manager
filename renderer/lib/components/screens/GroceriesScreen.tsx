import React, { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import supabase from "../../api/supabase_client";
import { ipcRenderer } from "electron";

export default function GroceriesScreen() {
  const [list, setList] = useState([]);
  const [checkedIndex, setCheckedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const notify = (title: string, body: string) => {
    ipcRenderer.invoke("notify", title, body);
  };

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

  const handleSetComplete = async (index) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Groceries")
        .update({ completed: !list[index].completed })
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
      notify("Groceries", "New groceries added to list!")
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
        <div className="mt-3 flex flex-col gap-3">
          {list.map((item, index) => {
            return (
              <div key={index} className="flex items-center gap-3">

                  <div
                    onClick={() => handleSetComplete(index)}
                    className="h-5 hover:cursor-pointer top-9 left-7 w-5 border rounded-full p-1"
                  >
                    {item.completed ? (
                      <img
                        src="../images/checkIcon.png"
                        alt=""
                        className="h-full w-full"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                <div className={`${item.completed ? "line-through" : ""}`}>
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mb-5"></div>
        <div
          onClick={() => handleInsertGroceries()}
          className="fixed z-20 top-5 right-5 hover:cursor-pointer"
        >
          <img src="/images/uploadIcon.png" alt="" className="h-7 w-7" />
        </div>
      </div>
    );
  }
}
