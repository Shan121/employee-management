import DropDownMenu from "./DropDownMenu";

const Header = () => {
  const categories = [
    {
      label: "Menu1",
      children: [
        {
          label: "Sub Menu1",
          children: [{ label: "item" }, { label: "item" }, { label: "item" }],
        },
        {
          label: "Sub Menu2",
          children: [{ label: "item" }, { label: "item" }],
        },
      ],
    },
    {
      label: "Menu2",
      children: [{ label: "item" }, { label: "item" }, { label: "item" }],
    },
  ];

  return (
    <div className="p-4">
      <DropDownMenu items={categories} />
    </div>
  );
};

export default Header;
