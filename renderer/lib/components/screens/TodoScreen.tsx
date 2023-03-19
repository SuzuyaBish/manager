import React, { useState } from "react";
import { BsArrowReturnLeft, BsCommand, BsEscape } from "react-icons/bs";
import Sheet from "react-modal-sheet";
import { MoonLoader } from "react-spinners";
import supabase from "../../api/supabase_client";
import TodoItem from "../TodoItem";

type TodoScreenProps = {
  todos: any[];
  loading: boolean;
};

export default function TodoScreen(props: TodoScreenProps) {
  const [todoLoading, setTodoLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const [todos, setTodos] = useState<any[]>([]);
  const [todoIndex, setTodoIndex] = useState(0);
  const [calendarShown, setCalendarShown] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDateMonth, setDueDateMonth] = useState("");
  const [dueDateDay, setDueDateDay] = useState("");
  const [dueDateYear, setDueDateYear] = useState("");
  const [assignedTo, setAssignedTo] = useState("Jay");

  const [newNote, setNewNote] = useState(false);
  const [openAssignment, setOpenAssignment] = useState(false);

  const [searchShown, setSearchShown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [cursorIndex, setCursorIndex] = useState(0);

  const Store = require("electron-store");
  const store = new Store();

  const currentUser = store.get("user");

  // function handleKeyDown(e) {
  //   if (e.keyCode === 75 && cursorIndex > 0) {
  //     e.preventDefault();
  //     setCursorIndex(cursorIndex - 1);

  //     const todoItem = document.getElementById(`todo${cursorIndex}`);
  //     todoItem.scrollIntoView({ behavior: "smooth", block: "end" });
  //   }
  //   if (e.keyCode === 74 && cursorIndex < props.todos.length - 1) {
  //     e.preventDefault();
  //     setCursorIndex(cursorIndex + 1);
  //     const todoItem = document.getElementById(`todo${cursorIndex}`);
  //     todoItem.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }

  //   if (e.keyCode === 74 && cursorIndex === props.todos.length - 1) {
  //     e.preventDefault();
  //   }

  //   if (e.key === "Enter" && !isOpen) {
  //     e.preventDefault();

  //     handleOpenTodo(cursorIndex);

  //     e.stopPropagation();
  //   }
  // }

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

    setTitle(props.todos[index]?.title);
    setDescription(props.todos[index]?.description);
    setDueDateDay(formatDate(props.todos[index]?.due_date).split(" ")[0]);
    setDueDateMonth(formatDate(props.todos[index]?.due_date).split(" ")[1]);
    setDueDateYear(formatDate(props.todos[index]?.due_date).split(" ")[2]);
    setAssignedTo(props.todos[index]?.assigned_to);

    // add a new keyboard listener that listnes for the escape key that doestn use handleKeyDown
    // document.addEventListener("keydown", function (e) {
    //   console.log(e.key);
    //   if (e.key === "Escape") {
    //     e.preventDefault();
    //     handleCloseModal();
    //   }
    //   // if key is meta plus enter
    //   if (e.key === "t" && e.metaKey) {
    //     if (newNote) {
    //       e.preventDefault();
    //       handleNewNote();
    //     } else {
    //       e.preventDefault();
    //       editTask();
    //     }
    //   }
    // });
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCalendarShown(false);
    setOpenAssignment(false);
    setNewNote(false);
    setAssignedTo("");
    setDescription("");
    setTitle("");

    // give focus to input with id keyboard
    // const input = document.getElementById("keyboardFocus");
    // input.focus();

    // const todoItem = document.getElementById(`todo${cursorIndex}`);
    // todoItem.scrollIntoView({ behavior: "smooth", block: "center" });
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
        .eq("id", props.todos[todoIndex]?.id);
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
        .update({ completed: props.todos[index].completed ? false : true })
        .eq("id", props.todos[index]?.id);
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
          title: title == "" ? "No title" : title,
          description: description == "" ? "No description" : description,
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
  };

  const checkIfOverdueOrClose = (date: string) => {
    const dateArray = date.split("-");
    const month = dateArray[1];
    const day = dateArray[2];
    const year = dateArray[0];

    const currentDate = new Date();
    const dueDate = new Date(`${month}/${day}/${year}`);

    const diffTime = Math.abs(dueDate.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      return true;
    } else {
      return false;
    }
  };

  if (props.loading) {
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
                  defaultValue={newNote ? "" : props.todos[todoIndex]?.title}
                  autoFocus
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task name here..."
                  className="mb-3 focus:border-none outline-none border-none focus:outline-none"
                />

                <textarea
                  name=""
                  id=""
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="h-24 resize-none focus:border-none outline-none border-none focus:outline-none"
                  defaultValue={
                    newNote ? "" : props.todos[todoIndex]?.description
                  }
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
                                  : props.todos[todoIndex]?.due_date.split(
                                      "-"
                                    )[2]
                              }
                              onChange={(e) => setDueDateDay(e.target.value)}
                              size={null}
                              className="w-5 outline-none focus:border-none border-none focus:outline-none"
                              maxLength={2}
                            />
                            <div className="px-2">/</div>
                            <input
                              type="text"
                              defaultValue={
                                newNote
                                  ? dueDateMonth
                                  : props.todos[todoIndex]?.due_date.split(
                                      "-"
                                    )[1]
                              }
                              onChange={(e) => setDueDateMonth(e.target.value)}
                              size={null}
                              className="w-5 focus:border-none focus:outline-none"
                              maxLength={2}
                            />
                            <div className="px-2">/</div>
                            <input
                              type="text"
                              defaultValue={
                                newNote
                                  ? dueDateYear
                                  : props.todos[todoIndex]?.due_date.split(
                                      "-"
                                    )[0]
                              }
                              onChange={(e) => setDueDateYear(e.target.value)}
                              size={null}
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
                        onClick={() =>
                          openAssignment
                            ? setOpenAssignment(false)
                            : setOpenAssignment(true)
                        }
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
                      <div className="flex items-center">
                        <div> Cancel</div>

                        {/* <div className="mx-2 border"></div>
                        <BsEscape size={14} /> */}
                      </div>
                    </div>
                    {todoLoading ? (
                      <div className="bg-purpleAccent text-white py-2.5 px-10 rounded-lg hover:cursor-pointer shadow-sm">
                        <MoonLoader color="#ffffff" size={14} />
                      </div>
                    ) : (
                      <div
                        onClick={() => (newNote ? handleNewNote() : editTask())}
                        className="bg-purpleAccent text-white py-1.5 px-6 rounded-lg flex items-center hover:cursor-pointer shadow-sm"
                      >
                        <div>{newNote ? "Create Task" : "Edit Task"}</div>
                        {/* <div className="mx-2 border"></div>
                        <div className="flex gap-1 items-center">
                          <BsCommand size={14} />
                          <BsArrowReturnLeft size={14} />
                        </div> */}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>

        {searchShown ? (
          <>
            <input
              autoFocus
              placeholder="Search term here..."
              className="w-full placeholder:text-xl text-xl pl-7 text-gray-500 focus:border-none focus:outline-none mt-0"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="border border-gray-100 my-4 mx-7" />
          </>
        ) : null}
        <input
          // onKeyDown={handleKeyDown}
          className="opacity-0 h-0 w-0 absolute"
          autoFocus
          id="keyboardFocus"
        />
        {props.todos.filter((todo) => {
          if (searchTerm == "") {
            return todo;
          } else if (
            todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.assigned_to.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return todo;
          }
        }).length == 0 ? (
          <div className="text-center text-gray-500 text-xl absolute top-[250px] left-[330px]">
            No tasks found
          </div>
        ) : (
          props.todos
            .filter((todo) => {
              if (searchTerm == "") {
                return todo;
              } else if (
                todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                todo.assigned_to
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return todo;
              }
            })
            .map(function (item, index) {
              return (
                <div id={"todo" + index} key={index} className="relative">
                  <div
                    onClick={() => setCompleted(index)}
                    className="h-6 hover:cursor-pointer top-9 left-7 absolute w-6 border rounded-full p-1"
                  >
                    {props.todos[index].completed ? (
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
                      overdueOrClose={checkIfOverdueOrClose(item.due_date)}
                      active={false}
                    />
                    <div className="border border-gray-100 my-4 mx-6" />
                  </div>
                </div>
              );
            })
        )}
        {/* <div className="fixed py-1 px-3 bottom-0 w-full bg-gray-400 backdrop-filter backdrop-blur-lg bg-opacity-20 border-t border-t-purple-300 text-greyText">
          <div className="flex justify-between">
            <div>Bottom bar</div>
            <div>Bottom bar</div>
          </div>
        </div> */}
        <div
          onClick={() => handleNewNoteOpen()}
          className="fixed z-20 top-5 right-5 hover:cursor-pointer"
        >
          <img src="/images/newNoteIcon.png" alt="" className="h-7 w-7" />
        </div>
        <div className="fixed flex flex-col items-center right-0 top-52 gap-6 bg-gray-100 p-2 rounded-tl-lg rounded-bl-lg">
          <div
            onClick={() => setSearchShown(!searchShown)}
            className="hover:cursor-pointer"
          >
            <img src="/images/searchIcon.png" alt="" className="h-7 w-7" />
          </div>

          <div
            className="hover:cursor-pointer"
          >
            <img src="/images/filterIcon.png" alt="" className="h-7 w-7" />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
