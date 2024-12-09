import React, { useEffect, useRef, useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  CloseIcon,
  CustomInfo,
  CustomButton,
  CustomPill,
  FormInput,
} from "@formsflow/components";
import { Form } from "@aot-technologies/formio-react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import utils from "@aot-technologies/formiojs/lib/utils";
import { saveFormProcessMapperPut } from "../../apiManager/services/processServices";

//TBD in case of Bundle form display
const PillList = React.memo(({ alternativeLabels, onRemove }) => {
  const { t } = useTranslation();
  return (
    <div className="pill-container">
      {Object.entries(alternativeLabels).length > 0 ? (
        Object.entries(alternativeLabels).map(
          ([key, { altVariable, labelOfComponent }]) => (
            <CustomPill
              key={key}
              label={altVariable || labelOfComponent}
              icon={
                key !== "applicationId" &&
                key !== "applicationStatus" && (
                  <CloseIcon color="#253DF4" data-testid="pill-remove-icon" />
                )
              }
              bg="#E7E9FE"
              onClick={() => onRemove(key)}
              secondaryLabel={key}
            />
          )
        )
      ) : (
        <p className="select-text">{t("Pick variables below")}</p>
      )}
    </div>
  );
});
// PropTypes for PillList
PillList.propTypes = {
  alternativeLabels: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};
const FormComponent = React.memo(
  ({
    form,
    alternativeLabels,
    setAlternativeLabels,
    selectedComponent,
    setSelectedComponent,
  }) => {
    const [showElement, setShowElement] = useState(false);
    const formRef = useRef(null);
    const detailsRef = useRef(null); // Ref for the details container
    const { t } = useTranslation();

    const ignoredTypes = new Set([
      "button",
      "columns",
      "panel",
      "well",
      "container",
      "htmlelement",
      "tabs",
    ]);
    const ignoredKeys = new Set(["hidden"]);
    const handleClick = useCallback(
      (e) => {
        const formioComponent = e.target.closest(".formio-component");
        const highlightedElement = document.querySelector(".formio-hilighted");

        if (highlightedElement) {
          highlightedElement.classList.remove("formio-hilighted");
        }

        if (formioComponent) {
          let classes = Array.from(formioComponent.classList).filter((cls) =>
            cls.startsWith("formio-component-")
          );
          const keyClass = classes[classes.length - 1];
          const typeClass = classes[classes.length - 2];
          //if key and type are same , then there will be only one class for both
          const componentType = typeClass
            ? typeClass.split("-").pop()
            : keyClass.split("-").pop();

          // Check if the component type is in the ignored list
          if (ignoredTypes.has(componentType)) {
            setShowElement(false);
            setSelectedComponent({
              key: null,
              type: "",
              label: "",
              altVariable: "",
            });
            return;
          }

          const componentKey = keyClass?.split("-").pop();
          // Check if the component key is in the ignored list
          if (ignoredKeys.has(componentKey)) {
            setShowElement(false);
            setSelectedComponent({
              key: null,
              type: "",
              label: "",
              altVariable: "",
            });
            return;
          }

          const labelElement = formioComponent.querySelector("label");
          let label = "";

          if (labelElement) {
            label = Array.from(labelElement.childNodes)
              .filter(
                (node) =>
                  !(
                    node.nodeType === Node.ELEMENT_NODE &&
                    node.classList.contains("sr-only")
                  )
              )
              .map((node) => node.textContent.trim())
              .join(" ");
          }

          // Highlight the selected component
          formioComponent.classList.add("formio-hilighted");
          setShowElement(true);

          // Update the selected component state
          setSelectedComponent({
            key: componentKey,
            type: componentType,
            label,
            altVariable: alternativeLabels[componentKey]?.altVariable || "",
          });
        } else {
          setSelectedComponent({
            key: null,
            type: "",
            label: "",
            altVariable: "",
          });
        }
      },
      [alternativeLabels]
    );
    // hide details when clicking outside form component and removinf the formio-highlighted class
    useEffect(() => {
      const formHilighter = document.querySelector(".form-hilighter");

      const handleOutsideClick = (event) => {
        const clickedInsideForm = formHilighter?.contains(event.target);
        const clickedInsideDetails = detailsRef.current?.contains(event.target);

        if (!clickedInsideForm && !clickedInsideDetails) {
          setShowElement(false);
          const highlightedElement =
            document.querySelector(".formio-hilighted");
          if (highlightedElement) {
            highlightedElement.classList.remove("formio-hilighted"); // Remove the highlight class
          }
        }
      };
      formHilighter?.addEventListener("click", handleClick);
      document.addEventListener("mousedown", handleOutsideClick);

      return () => {
        formHilighter?.removeEventListener("click", handleClick);
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [handleClick]);

    const handleAddAlternative = () => {
      if (selectedComponent.key) {
        setAlternativeLabels((prev) => ({
          ...prev,
          [selectedComponent.key]: {
            altVariable: selectedComponent.altVariable,
            labelOfComponent: selectedComponent.label,
            type: selectedComponent.type,
            key: selectedComponent.key,
          },
        }));
        const highlightedElement = document.querySelector(".formio-hilighted");
        if (highlightedElement) {
          highlightedElement.classList.remove("formio-hilighted");
        }
      }
      setShowElement(false);
    };

    return (
      <div className="d-flex">
        <div className="flex-grow-1 form-hilighter form-field-container">
          <Form
            form={form}
            options={{
              viewAsHtml: true,
              readOnly: true,
            }}
            formReady={(e) => {
              formRef.current = e;
            }}
          />
        </div>

        <div className="field-details-container" ref={detailsRef}>
          {showElement ? (
            <div className="details-section">
              <div className="d-flex flex-column">
                <span>{t("Type")}:</span>
                <span className="text-bold"> {selectedComponent.type}</span>
              </div>
              <div className="d-flex flex-column">
                <span>{t("Variable")}:</span>
                <span className="text-bold">{selectedComponent.key}</span>
                {/* TBD in case of Bundle  */}
              </div>
              <FormInput
                type="text"
                ariaLabel="Add alternative label input"
                dataTestid="Add-alternative-input"
                label="Add Alternative Label"
                value={selectedComponent.altVariable}
                onChange={(e) =>
                  setSelectedComponent((prev) => ({
                    ...prev,
                    altVariable: e.target.value,
                  }))
                }
              />
              <CustomButton
                dataTestid="Add-alternative-btn"
                ariaLabel="Add alternative label button"
                size="sm"
                label={
                  alternativeLabels[selectedComponent.key]
                    ? t("Update Variable")
                    : t("Add Variable")
                }
                onClick={handleAddAlternative}
                className="w-75"
                disabled={
                  selectedComponent.altVariable ===
                  alternativeLabels[selectedComponent.key]?.altVariable
                } //TBD need to create a variable to compare values
              />
            </div>
          ) : (
            <p className="select-text">
              {t("Select a form field on the left")}
            </p>
          )}
        </div>
      </div>
    );
  }
);

// PropTypes for FormComponent
FormComponent.propTypes = {
  form: PropTypes.object.isRequired,
  alternativeLabels: PropTypes.object.isRequired,
  setAlternativeLabels: PropTypes.func.isRequired,
  selectedComponent: PropTypes.object.isRequired,
  setSelectedComponent: PropTypes.func.isRequired,
};
const TaskVariableModal = React.memo(
  ({ showTaskVarModal, isPublished = false, onClose, form,layoutNotsaved }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const formProcessList = useSelector(
      (state) => state.process.formProcessList
    );
    const [alternativeLabels, setAlternativeLabels] = useState({});

    useEffect(() => {
      //filtering applicationId and applicationStatus components from form
      const filteredComponents = Object.values(
        utils.flattenComponents(form.components)
      ).filter(
        ({ key }) => key === "applicationStatus" || key === "applicationId"
      );

      const updatedLabels = {};
      // Add filtered components to updatedLabels
      filteredComponents.forEach(({ key, label, type }) => {
        updatedLabels[key] = {
          key,
          altVariable: label,
          labelOfComponent: label,
          type: type,
        };
      });

      // Add taskVariables to updatedLabels
      formProcessList?.taskVariables?.forEach(({ key, label, type }) => {
        updatedLabels[key] = {
          key,
          altVariable: label, // Use label from taskVariables as altVariable
          labelOfComponent: label, // Set the same label for labelOfComponent
          type: type,
        };
      });
      setAlternativeLabels(updatedLabels);
    }, [formProcessList]);
    const [selectedComponent, setSelectedComponent] = useState({
      key: null,
      type: "",
      label: "",
      altVariable: "",
    });
    const removeSelectedVariable = useCallback((key) => {
      setSelectedComponent((prev) => ({
        ...prev,
        altVariable: "",
      }));
      setAlternativeLabels((prev) => {
        const newLabels = { ...prev };
        delete newLabels[key];
        return newLabels;
      });
    }, []);

    const handleClose = () => onClose();

    const handleSaveTaskVariable = async () => {
      const currentTaskVariables = Object.values(alternativeLabels).map(
        (i) => ({
          key: i.key,
          label: i.altVariable || i.labelOfComponent, // If altVariable exists, use it, otherwise it will be  labelOfComponent
          type: i.type,
        })
      );
      const mapper = {
        formId: formProcessList.formId,
        id: formProcessList.id,
        parentFormId: formProcessList.parentFormId,
        taskVariables: currentTaskVariables,
        formName: formProcessList.formName,
      };
      await dispatch(saveFormProcessMapperPut({ mapper }));
      onClose();
    };
    return (
      <Modal
        show={showTaskVarModal}
        onHide={handleClose}
        className="task-variable-modal"
        size="lg"
        centered={true}
      >
        <Modal.Header>
          <Modal.Title>
            {layoutNotsaved
              ? t("Selecting Variables Is Not Available")
              : t("Variables for Flow, Submissions, and Tasks")}
          </Modal.Title>
          <div className="d-flex align-items-center">
            <CloseIcon width="16.5" height="16.5" onClick={handleClose} />
          </div>
        </Modal.Header>
        <Modal.Body>
          {layoutNotsaved ? (
            // Content when layoutNotsaved is true
            <div className="info-pill-container">
              <CustomInfo
                heading={t("Note")}
                content={t(
                  "Variables can be accessed only when there are no pending changes to the layout. Please go back to the layout section and save or discard your changes."
                )}
              />
            </div>
          ) : (
            // Content when layoutNotsaved is false
            <>
              <div className="info-pill-container">
                <CustomInfo
                  heading="Note"
                  content="To use variables in the flow, as well as sorting by them in 
                  the submissions and tasks you need to specify which variables you want to import from the layout. Variables get imported into the system at the time of the submission, if the variables that are needed 
                 are not selected prior to the form submission THEY WILL NOT BE AVAILABLE in the flow, submissions, and tasks."
                />
                <div>
                  <label className="selected-var-text">
                    {t("Selected Variables")}
                  </label>
                  <PillList
                    alternativeLabels={alternativeLabels}
                    onRemove={removeSelectedVariable}
                  />
                </div>
              </div>
              <div className="variable-container">
                <FormComponent
                  form={form}
                  alternativeLabels={alternativeLabels}
                  setAlternativeLabels={setAlternativeLabels}
                  setSelectedComponent={setSelectedComponent}
                  selectedComponent={selectedComponent}
                />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
        {layoutNotsaved ? (
    // Footer content when layoutNotsaved is true
    <>
    <CustomButton
      variant="primary"
      size="md"
      className=""
      label={t("Back to Layout")}
      ariaLabel="Back to Layout btn"
      dataTestid="back-to-layout-btn"
      onClick={handleClose}
    />
    <CustomButton
        variant="secondary"
        size="md"
        className=""
        label={t("Cancel")}
        ariaLabel="Cancel btn"
        dataTestid="cancel-btn"
        onClick={handleClose}
      />
    </>
  ) : (
    // Footer content when layoutNotsaved is false
    <>
      <CustomButton
        variant="primary"
        size="md"
        className=""
        disabled={isPublished}
        label={t("Save")}
        ariaLabel="save task variable btn"
        dataTestid="save-task-variable-btn"
        onClick={handleSaveTaskVariable}
      />
      <CustomButton
        variant="secondary"
        size="md"
        className=""
        label={t("Cancel")}
        ariaLabel="Cancel btn"
        dataTestid="cancel-btn"
        onClick={handleClose}
      />
    </>
  )}
        </Modal.Footer>
      </Modal>
    );
  }
);

// PropTypes for TaskVariableModal
TaskVariableModal.propTypes = {
  showTaskVarModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  isPublished: PropTypes.bool.isRequired,
  layoutNotsaved: PropTypes.bool.isRequired
};
export default TaskVariableModal;
