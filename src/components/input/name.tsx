import { IonInput, IonButton } from "@ionic/react";
import { useEffect, useRef } from "react";

interface NameInputProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  isEditingName: boolean; // New prop to control editing state
  onClose: () => void; // Function to close the editor (pass this from the parent)
}

const NameInput = ({
  name,
  setName,
  isEditingName,
  onClose,
}: NameInputProps) => {
  const inputRef = useRef<HTMLIonInputElement>(null);

  // Focus input element when it is rendered and editing
  useEffect(() => {
    if (inputRef.current && isEditingName) {
      setTimeout(() => {
        inputRef.current?.setFocus();
      }, 100); // Delay to ensure input is focused after rendering
    }
  }, [isEditingName]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IonInput
        ref={inputRef}
        value={name}
        type="text"
        inputMode="text"
        placeholder="ชื่อบิล"
        onIonChange={(e) => {
          const newValue = e.detail.value;
          if (newValue) setName(newValue);
        }}
        disabled={!isEditingName} // Disable input if not editing
      />

      {isEditingName && (
        <IonButton
          onClick={onClose}
          color="danger"
          style={{ marginLeft: "10px" }}
        >
          Close
        </IonButton>
      )}
    </div>
  );
};

export default NameInput;
