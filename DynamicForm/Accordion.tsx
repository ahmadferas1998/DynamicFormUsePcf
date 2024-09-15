import * as React from "react";

interface AccordionProps {
  title?: string;
  children?: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="accordion-item mb-10 mt-5">
      <div className="accordion-header title">
      {title}
        {/* <button
          className="accordion-button"
          onClick={toggleAccordion}
        >
     
        </button> */}
      </div>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
};

export default Accordion;
