import React from "react";

type TodoItemProps = {
  title: string;
  children: React.ReactNode;
};

export default function GrocerieItem(props: TodoItemProps) {
  return (
    <React.Fragment>
      <div className=" flex items-center justify-between">
        <div>{props.title}</div>
        {props.children}
      </div>
    </React.Fragment>
  );
}
