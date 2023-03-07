import React, { useEffect, useState } from "react";
import Sheet from "react-modal-sheet";
import { MoonLoader } from "react-spinners";
import supabase from "../../api/supabase_client";
import TodoItem from "../TodoItem";

export default function TodoScreen() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const [todoIndex, setTodoIndex] = useState(null);

  const todoItems = Array.from({ length: 10 }, (_, i) => i);

  useEffect(() => {
    loadTodos();
    console.log("Called");

    supabase
      .channel("any")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Todos" },
        (payload) => {
          console.log("Received realtime payload:", payload);
          loadTodos();
        }
      )
      .subscribe();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("Todos").select();

      if (data) {
        setTodos(data);
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

  const formatDate = (date: string) => {
    const dateArray = date.split("-");
    const month = dateArray[1];
    const day = dateArray[2];
    const year = dateArray[0];

    const months = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      "10": "October",
      "11": "November",
      "12": "December",
    };

    return `${day} ${months[month]} ${year}`;
  };

  const handleOpenTodo = (index: number) => {
    setIsOpen(true);
    setTodoIndex(index);
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
        <Sheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          detent="content-height"
        >
          <Sheet.Container>
            <Sheet.Content>
              <form className="p-5 flex flex-col text-greyText">
                <input
                  value={todos[todoIndex]?.title}
                  autoFocus
                  type="text"
                  placeholder="Task name here..."
                  className="mb-3 focus:border-none focus:outline-none"
                />

                <textarea
                  name=""
                  id=""
                  placeholder="Description"
                  className="h-24 resize-none focus:border-none focus:outline-none"
                  value={todos[todoIndex]?.description}
                ></textarea>
                <div className="flex justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-greyText border py-1.5 gap-2 px-3 rounded-lg shadow-sm">
                      <img
                        src="../images/calendarFine.png"
                        alt=""
                        className="h-5 w-5"
                      />
                      <div>Due Date</div>
                    </div>

                    <div className="flex items-center text-greyText border py-1.5 px-3 gap-3 rounded-lg shadow-sm">
                      <img
                        src="../images/userIcon.png"
                        alt=""
                        className="h-5 w-5"
                      />
                      <div>Assign To</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => setIsOpen(false)}
                      className="border py-1.5 px-6 rounded-lg hover:cursor-pointer shadow-sm"
                    >
                      Cancel
                    </div>
                    <div className="bg-purpleAccent text-white py-1.5 px-6 rounded-lg hover:cursor-pointer shadow-sm">
                      Add Task
                    </div>
                  </div>
                </div>
              </form>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
        {todos.map(function (item, index) {
          return (
            <div key={index} onClick={() => handleOpenTodo(index)}>
              <TodoItem
                key={index}
                title={item.title}
                description={item.description}
                completed={item.completed}
                assignedTo={item.assigned_to}
                dueDate={formatDate(item.due_date)}
              />
            </div>
          );
        })}

        {/* {todoItems.map(function (item, index) {
          return (
            <div key={index} onClick={() => setIsOpen(true)}>
              <TodoItem
                key={index}
                title="Task Name"
                description="Description"
                completed={false}
                assignedTo="Jay"
                dueDate={formatDate("01-01-2021")}
              />
            </div>
          );
        })} */}
      </React.Fragment>
    );
  }
}
