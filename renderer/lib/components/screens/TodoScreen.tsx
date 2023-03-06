import React, { useState } from "react";
import Sheet from "react-modal-sheet";
import supabase from "../../api/supabase_client";
import TodoItem from "../TodoItem";

export default function TodoScreen() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);

  const todoItems = Array.from({ length: 10 }, (_, i) => i);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: "sloan.jarrod@gmail.com",
        password: "password",
      });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
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
                type="text"
                placeholder="Task name here..."
                className="mb-3 focus:border-none focus:outline-none"
              />

              <textarea
                name=""
                id=""
                placeholder="Description"
                className="h-24 resize-none focus:border-none focus:outline-none"
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
      {todoItems.map(function (item, index) {
        return (
          <div onClick={() => setIsOpen(true)}>
            <TodoItem
              key={index}
              title="title"
              description="description"
              completed={true}
              assignedTo="Jay"
              dueDate="29 April 2023"
            />
          </div>
        );
      })}
    </React.Fragment>
  );
}
