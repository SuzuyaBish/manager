import React from "react";

type TodoItemProps = {
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  completed: boolean;
  overdueOrClose: boolean;
  active: boolean;
};

export default function TodoItem(props: TodoItemProps) {
  return (
    <React.Fragment>
      <div
        className={`${
          props.active ? "bg-gray-100" : null
        } mx-20 hover:cursor-pointer rounded-xl p-2`}
      >
        <div className="pr-10">
          <div>{props.title}</div>
          <div className="truncate text-ellipsis overflow-hidden max-w-lg text-greyText">
            {props.description}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <img
                src="../images/calendarFine.png"
                alt=""
                className="h-4 w-4"
              />
              <div
                className={`${
                  props.overdueOrClose ? "text-red-500" : "text-greyText"
                }`}
              >
                {props.dueDate}
              </div>
            </div>
            <div className="rounded-full h-1 w-1 bg-gray-300" />
            <div className="flex items-center gap-1">
              <img src="../images/userIcon.png" alt="" className="h-4 w-4" />
              <div className="text-greyText">{props.assignedTo}</div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
