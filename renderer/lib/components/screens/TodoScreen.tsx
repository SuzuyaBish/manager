import React, { useEffect, useState } from "react";
import Sheet from "react-modal-sheet";
import { MoonLoader } from "react-spinners";
import supabase from "../../api/supabase_client";
import TodoItem from "../TodoItem";

export default function TodoScreen() {
  const [todoLoading, setTodoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const [todoIndex, setTodoIndex] = useState(null);
  const [calendarShown, setCalendarShown] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDateMonth, setDueDateMonth] = useState("");
  const [dueDateDay, setDueDateDay] = useState("");
  const [dueDateYear, setDueDateYear] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [newNote, setNewNote] = useState(false);
  const [openAssignment, setOpenAssignment] = useState(false);

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
      const { data, error } = await supabase
        .from("Todos")
        .select()
        .order("completed", { ascending: true })
        .order("due_date", { ascending: false });

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

    setTitle(todos[index]?.title);
    setDescription(todos[index]?.description);
    setDueDateDay(formatDate(todos[index]?.due_date).split(" ")[0]);
    setDueDateMonth(formatDate(todos[index]?.due_date).split(" ")[1]);
    setDueDateYear(formatDate(todos[index]?.due_date).split(" ")[2]);
    setAssignedTo(todos[index]?.assigned_to);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCalendarShown(false);
    setOpenAssignment(false);
    setNewNote(false);
    setAssignedTo("");
  };

  const editTask = async () => {
    try {
      setTodoLoading(true);
      const { data, error } = await supabase
        .from("Todos")
        .update({
          title,
          description,
          due_date: `${dueDateYear}-${dueDateMonth}-${dueDateDay}`,
          assigned_to: assignedTo,
        })
        .eq("id", todos[todoIndex]?.id);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsOpen(false);
      // loadTodos();
      setTodoLoading(false);
    }
  };

  const setCompleted = async (index: number) => {
    try {
      // setLoading(true);
      const { data, error } = await supabase
        .from("Todos")
        .update({ completed: todos[index].completed ? false : true })
        .eq("id", todos[index]?.id);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      // loadTodos();
      // setLoading(false);
    }
  };

  const handleNewNote = async () => {
    try {
      setTodoLoading(true);
      const { data, error } = await supabase.from("Todos").insert([
        {
          title,
          description,
          due_date: `${dueDateYear}-${dueDateMonth}-${dueDateDay}`,
          assigned_to: assignedTo == "" ? "No one" : assignedTo,
          completed: false,
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsOpen(false);
      // loadTodos();
      setTodoLoading(false);
    }
  };

  const handleNewNoteOpen = () => {
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const day = currentDay < 10 ? `0${currentDay}` : currentDay;
    const month = currentMonth < 10 ? `0${currentMonth}` : currentMonth;

    setDueDateDay(day.toString());
    setDueDateMonth(month.toString());
    setDueDateYear(currentYear.toString());

    setIsOpen(true);
    setNewNote(true);
  };

  const handleSetAssignment = (name: string) => {
    setAssignedTo(name);
    setOpenAssignment(false);
  }


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
                  defaultValue={newNote ? "" : todos[todoIndex]?.title}
                  autoFocus
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task name here..."
                  className="mb-3 focus:border-none focus:outline-none"
                />

                <textarea
                  name=""
                  id=""
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="h-24 resize-none focus:border-none focus:outline-none"
                  defaultValue={newNote ? "" : todos[todoIndex]?.description}
                ></textarea>
                <div className="flex justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => setCalendarShown(true)}
                      className="flex hover:cursor-pointer items-center text-greyText border py-1.5 gap-2 px-3 rounded-lg shadow-sm"
                    >
                      {calendarShown ? (
                        <div className="flex gap-3 items-center">
                          <img
                            src="../images/calendarFine.png"
                            alt=""
                            className="h-5 w-5"
                          />
                          <div className="flex items-center">
                            <input
                              autoFocus
                              type="text"
                              defaultValue={
                                newNote
                                  ? dueDateDay
                                  : todos[todoIndex]?.due_date.split("-")[2]
                              }
                              onChange={(e) => setDueDateDay(e.target.value)}
                              size=""
                              className="w-5 focus:border-none focus:outline-none"
                              maxLength={2}
                            />
                            <div className="px-2">/</div>
                            <input
                              type="text"
                              defaultValue={
                                newNote
                                  ? dueDateMonth
                                  : todos[todoIndex]?.due_date.split("-")[1]
                              }
                              onChange={(e) => setDueDateMonth(e.target.value)}
                              size=""
                              className="w-5 focus:border-none focus:outline-none"
                              maxLength={2}
                            />
                            <div className="px-2">/</div>
                            <input
                              type="text"
                              defaultValue={
                                newNote
                                  ? dueDateYear
                                  : todos[todoIndex]?.due_date.split("-")[0]
                              }
                              onChange={(e) => setDueDateYear(e.target.value)}
                              size=""
                              className="w-10 focus:border-none focus:outline-none"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <img
                            src="../images/calendarFine.png"
                            alt=""
                            className="h-5 w-5"
                          />
                          <div>Due Date</div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center relative text-greyText border py-1.5 px-3 gap-3 rounded-lg shadow-sm">
                      {openAssignment ? (
                        <div className="absolute -top-24 left-0 w-full bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200 shadow-sm p-2 flex flex-col">
                          <div
                            onClick={() => handleSetAssignment("Jay")}
                            className="hover:cursor-pointer"
                          >
                            Jay
                          </div>
                          <div className="border my-2 border-gray-200 w-full" />
                          <div
                            onClick={() => handleSetAssignment("Jorene")}
                            className="hover:cursor-pointer"
                          >
                            Jorene
                          </div>
                        </div>
                      ) : null}
                      <div
                        onClick={() => openAssignment ? setOpenAssignment(false) : setOpenAssignment(true)}
                        className="flex hover:cursor-pointer items-center gap-2"
                      >
                        <img
                          src="../images/userIcon.png"
                          alt=""
                          className="h-5 w-5"
                        />
                        <div>{assignedTo == "" ? "Assign to" : assignedTo}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => handleCloseModal()}
                      className="border py-1.5 px-6 rounded-lg hover:cursor-pointer shadow-sm"
                    >
                      Cancel
                    </div>
                    {todoLoading ? (
                      <div className="bg-purpleAccent text-white py-2.5 px-10 rounded-lg hover:cursor-pointer shadow-sm">
                        <MoonLoader color="#ffffff" size={14} />
                      </div>
                    ) : (
                      <div
                        onClick={() => (newNote ? handleNewNote() : editTask())}
                        className="bg-purpleAccent text-white py-1.5 px-6 rounded-lg hover:cursor-pointer shadow-sm"
                      >
                        {newNote ? "Create Task" : "Edit Task"}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
        {todos.map(function (item, index) {
          return (
            <div key={index} className="relative">
              <div
                onClick={() => setCompleted(index)}
                className="h-6 hover:cursor-pointer top-7 left-7 absolute w-6 border rounded-full p-1"
              >
                {todos[index].completed ? (
                  <img
                    src="../images/checkIcon.png"
                    alt=""
                    className="h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <div onClick={() => (isOpen ? null : handleOpenTodo(index))}>
                <TodoItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  completed={item.completed}
                  assignedTo={item.assigned_to}
                  dueDate={formatDate(item.due_date)}
                />
                <div className="border border-gray-100 my-4 mx-6" />
              </div>
            </div>
          );
        })}
        <div
          onClick={() => handleNewNoteOpen()}
          className="absolute top-5 right-5 hover:cursor-pointer"
        >
          <img src="/images/newNoteIcon.png" alt="" className="h-7 w-7" />
        </div>
      </React.Fragment>
    );
  }
}
