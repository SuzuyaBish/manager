import React from "react";

type TodoItemProps = {
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  completed: boolean;
};

export default function TodoItem(props: TodoItemProps) {
  return (
    <React.Fragment>
      <div className="px-5">
        <div className="flex items-center gap-5">
          <div className="h-6 w-6 border rounded-full p-1">
            {props.completed ? (
              <img src="../images/checkIcon.png" alt="" className="h-full w-full" />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
          <div className="pr-10">
            <div>{props.title}</div>
            <div className="truncate text-ellipsis overflow-hidden max-w-lg text-greyText">
              {props.description}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <img src="../images/calendarFine.png" alt="" className="h-4 w-4" />
                <div className="text-greyText">{props.dueDate}</div>
              </div>
              <div className="rounded-full h-1 w-1 bg-gray-300" />
              <div className="flex items-center gap-1">
                <img src="../images/userIcon.png" alt="" className="h-4 w-4" />
                <div className="text-greyText">{props.assignedTo}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-100 my-4 mx-6" />
    </React.Fragment>
  );
}
