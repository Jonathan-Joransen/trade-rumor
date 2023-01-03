import styles from "../styles/Dropdown.module.css";
import React from "react";

function Dropdown({
  children,
  title,
  titleSize = "regular",
}: {
  children: Array<React.ReactNode> | React.ReactNode;
  title: string;
  titleSize?: string;
}) {
  const dropdownItems = React.createRef();
  const dropdownIcon = React.createRef();

  let changeDropdownState = () => {
    const dr = dropdownItems.current as HTMLDivElement;
    const icon = dropdownIcon.current as HTMLDivElement;
    if (dr.getAttribute("aria-expanded") === "true") {
        dr.setAttribute("aria-expanded", "false");
        dr.classList.add(styles.dropdownItemsClosed);
        icon.setAttribute("data-state", "closed");
    } else {
        dr.classList.remove(styles.dropdownItemsClosed);
        dr?.setAttribute("aria-expanded", "true");
        icon?.setAttribute("data-state", "opened");
    }
  };

  return (
    <div className={styles.container}>
      <div
        id="dropdown"
        className={styles.dropdownHeader}
        onClick={() => changeDropdownState()}
      >
         <h1 className={styles.dropdownTitle} data-size={titleSize} >{title}</h1> 
        <img
          ref={dropdownIcon as React.RefObject<HTMLImageElement>}
        data-state="opened"
        data-size={titleSize}
        className={styles.dropdownIcon}
          src={"../images/right-chevron-white.png"}
        ></img>
      </div>
      <div
        ref={dropdownItems as React.RefObject<HTMLDivElement>}
        aria-expanded="true"
        className={styles.dropdownItems}
      >
        { children instanceof Array<React.ReactNode> ? 
        children.map((child: React.ReactNode, idx) => (
          <div key={idx} className={styles.dropdownItem}>{child}</div>
        )) : children
      }
      </div>
    </div>
  );
}

export default Dropdown;
