import { Button } from "antd";

const ButtonForm = ({ onSubmit, onCancel }: any) => {
  const handleSubmit = () => {
    onSubmit();
  };
  return (
    <div>
      <Button onClick={handleSubmit} type="primary">
        Send
      </Button>
      <Button key="back" onClick={onCancel}>
        Close
      </Button>
    </div>
  );
};

export default ButtonForm;
