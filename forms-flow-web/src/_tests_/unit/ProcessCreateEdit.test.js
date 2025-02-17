jest.mock("../../apiManager/services/processServices", () => {
  
  const actual = jest.requireActual("../../apiManager/services/processServices");
  return {
    ...actual,
    createProcess: jest.fn((args) => {
      console.log("Mocked createProcess called with:", args);
      return Promise.resolve({ data: { id: 1, name: "Test Process" } });
    }),
    updateProcess: jest.fn().mockResolvedValue({ data: {} }), 
    publish: jest.fn(() => actual.publish()),  
    unPublish: jest.fn(() => actual.unPublish()),
    getProcessDetails: jest.fn().mockResolvedValue({ data: {} }),
    getProcessHistory: jest.fn(() => actual.getProcessHistory()),
    fetchRevertingProcessData: jest.fn(() => actual.fetchRevertingProcessData()),
  }
});

jest.mock("../../components/Modeler/Editors/BpmnEditor/BpmEditor.js", () => {
  const React = require('react');
  return {
  __esModule: true,
  default: React.forwardRef((props, ref) => {
    // Implement mock methods that will be called via ref
    React.useImperativeHandle(ref, () => ({
      getXML: jest.fn().mockResolvedValue("<xml>test-xml</xml>"),
      setXML: jest.fn().mockResolvedValue(undefined),
      modeler: {
        saveXML: jest.fn().mockResolvedValue({
          xml: '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definition_1">\n<bpmn:process id="Process_1" isExecutable="false"></bpmn:process>\n</bpmn:definitions>'
        })
      },
      getBpmnModeler: jest.fn().mockResolvedValue("<xml>test-xml</xml>"),
      handleImport:jest.fn()
    }));

    return (
      <div data-testid="bpmn-editor"
        onClick={() => props.onChange && props.onChange("<new-bpmn-xml>")}
      >
        Mocked BPMN Editor
      </div>
    );
  })
};
});

jest.mock("../../components/Modeler/Editors/DmnEditor/DmnEditor.js", () => {
  const React = require('react');
  return {
  __esModule: true,
  default: React.forwardRef((props, ref) => {
    // Implement mock methods that will be called via ref
    React.useImperativeHandle(ref, () => ({
      getXML: jest.fn().mockResolvedValue("<xml>test-xml</xml>"),
      setXML: jest.fn().mockResolvedValue(undefined),
      modeler: {
        saveXML: jest.fn().mockResolvedValue({
          xml: '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definition_1">\n<bpmn:process id="Process_1" isExecutable="false"></bpmn:process>\n</bpmn:definitions>'
        })
      },
      getBpmnModeler: jest.fn().mockResolvedValue("<xml>test-xml</xml>"),
      handleImport:jest.fn()
    }));

    return (
      <div data-testid="dmn-editor"
        onClick={() => props.onChange && props.onChange("<new-dmn-xml>")}
      >
        Mocked DMN Editor
      </div>
    );
  })
}
});


jest.mock("../../helper/processHelper", () => {
  const actual = jest.requireActual("../../helper/processHelper");
  return {
  validateProcess: () =>actual.validateProcess,
  validateDecisionNames: () => {return true},
  compareXML: () => {return true},
  // createXMLFromModeler: jest.fn(() => Promise.resolve("<xml>1</xml>")),
  createXMLFromModeler: () => {return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_49a3inm" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.0.0" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.17.0">
  <bpmn:process id="Processyy_nm9ewcsAAQQQ" name="AAA12y3" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="AAA">
      <bpmn:outgoing>Flow_1cawbcg</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_0fngdxtAA" name="tygub">
      <bpmn:incoming>Flow_1cawbcg</bpmn:incoming>
      <bpmn:outgoing>Flow_1jdbs66</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1cawbcg" name="AAA" sourceRef="StartEvent_1" targetRef="Activity_0fngdxtAA" />
    <bpmn:endEvent id="Event_0g5jxoy" name="AAA">
      <bpmn:incoming>Flow_1jdbs66</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1jdbs66" sourceRef="Activity_0fngdxtAA" targetRef="Event_0g5jxoy" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Processyy_nm9ewcsAAQQQ">
      <bpmndi:BPMNShape id="Activity_0fngdxt_di" bpmnElement="Activity_0fngdxtAA">
        <dc:Bounds x="480" y="160" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0g5jxoy_di" bpmnElement="Event_0g5jxoy">
        <dc:Bounds x="752" y="142" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="759" y="185" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="142" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="186" y="185" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1cawbcg_di" bpmnElement="Flow_1cawbcg">
        <di:waypoint x="215" y="160" />
        <di:waypoint x="348" y="160" />
        <di:waypoint x="348" y="200" />
        <di:waypoint x="480" y="200" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="404" y="182" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1jdbs66_di" bpmnElement="Flow_1jdbs66">
        <di:waypoint x="580" y="200" />
        <di:waypoint x="666" y="200" />
        <di:waypoint x="666" y="160" />
        <di:waypoint x="752" y="160" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
  },
}
});

// jest.mock("@formsflow/service", () => {
//   const actual = jest.requireActual("@formsflow/service"); // Get actual module

//   return {
//     ...actual, // Preserve all other methods
//     RequestService:{
//       httpPOSTRequest: () => Promise.resolve(jest.fn(() => ({ data: {} })))
//     }};
// });


jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify')
}));


import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ProcessCreateEdit from "../../components/Modeler/ProcessCreateEdit";
import "@testing-library/jest-dom";
import { useParams } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { QueryClient, QueryClientProvider } from "react-query"; // Add this import at the top
import { mockstate } from "./mockState";
import userEvent from '@testing-library/user-event';
import {
  setProcessData,
} from "../../actions/processActions";
import * as processServices from "../../apiManager/services/processServices";

const queryClient = new QueryClient();
const store = configureStore({
  reducer: rootReducer,
  preloadedState: mockstate,
});


jest.mock("connected-react-router", () => ({
  push: jest.fn(), // Mock push() to avoid real navigation
  ConnectedRouter: ({ children }) => children, // Mock ConnectedRouter if used
}));

jest.mock('../../actions/processActions', () => ({
  setProcessData: jest.fn().mockImplementation((data) => (dispatch) => {
    // Mock implementation
    dispatch({
      type: 'SET_PROCESS_DATA',
      payload: data,
    })
  }),
  setProcessDiagramXML: jest.fn()
}));

// jest.mock('../../components/Modals/ActionModal', () => {
//   const actual = jest.requireActual("../../../__mocks__/ActionModal.mock.js");
//   return {
//     ...actual,
//     handleAction: actual.handleAction
//   }
// });

// jest.mock("../../components/Modals/ActionModal", () => require("../../../__mocks__/ActionModal.mock.js"));


// Mock the @formsflow/components package and replace CloseIcon with the mocked component
jest.mock("@formsflow/components", () => {
  const actual = jest.requireActual("../../../__mocks__/@formsflow/components");
  return {
    ...actual,
    BackToPrevIcon: () => <span>Back</span>,
    HistoryIcon: () => <span>History Icon</span>,
    CloseIcon: actual.CloseIcon,
    DuplicateIcon: () => <span>Duplicate Icon</span>,
    ImportIcon: () => <span>Import Icon</span>,
    PencilIcon: () => <span>Pencil Icon</span>,
    ErrorModal: () => <div>Error Modal</div>,
    HistoryModal: () => <div>History Modal</div>,
    CustomButton: actual.CustomButton,
    CustomInfo: actual.CustomInfo,
    FailedIcon:actual.FailedIcon,
    InfoIcon:actual.InfoIcon
  };
});


// Mock process data with unpublished status
 const mockStateDraft = {
  ...mockstate,
  process: {
    ...mockstate.process,
    processData: {
      ...mockstate.process.processData,
      status: "Draft"
    }
  }
};


// Mock process data with published status
const mockStatePublished = {
  ...mockstate,
  process: {
    ...mockstate.process,
    processData: {
      ...mockstate.process.processData,
      status: "Published"
    }
  }
};

jest.spyOn(require("react-query"), "useQuery").mockImplementation(() => ({
  isLoading: false,
  data: {
    data: mockStatePublished.process.processData
  },
  error: null
}));

const mockBlockCallback = jest.fn((tx) => {
  // Simulate the block callback logic
  if (tx.pathname === mockHistory.location.pathname) return true;
  return false;
});

// Create mock block function that returns the unblock function
const mockBlock = jest.fn((callback) => {
  // Store the callback
  mockBlockCallback.mockImplementation(callback);
  return jest.fn(); // Return the unblock function
});

const mockHistory = {
  block: mockBlock,
  location: {
    pathname: '/current/path'
  },
  push: jest.fn(),
  listen: jest.fn(),
  createHref: jest.fn()
};

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn(() => {
      return {processKey:'test-process-key' , 'step':'create'};
    }),
     useLocation: jest.fn(),
    useHistory: () => mockHistory,
    useNavigate: () => mockHistory 
  };
});


// Add this polyfill before the tests
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    return this.replace(
      new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      newStr
    );
  };
}


const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>{children}</Provider>
  </QueryClientProvider>
);

const defaultPropsBPMN = {
  type: "BPMN",
  Process: {
    name: "Subflow",
    type: "BPMN",
    route: "subflow",
    extension: ".bpmn",
    fileType: "text/bpmn",
  }
};
const renderBPMNComponent = (props = {}) => {
  return render(<ProcessCreateEdit {...defaultPropsBPMN} {...props} />, { wrapper });
};

const storePublished = configureStore({
  reducer: rootReducer,
  preloadedState: mockStatePublished
});

const wrapperWithMockStorePublished = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <Provider store={storePublished}>{children}</Provider>
  </QueryClientProvider>
);

const renderBPMNComponentWithPublished = (props = {}) => {
  return render(<ProcessCreateEdit {...defaultPropsBPMN} {...props} />, { wrapper : wrapperWithMockStorePublished});
};


const storeDraft = configureStore({
  reducer: rootReducer,
  preloadedState: mockStateDraft
});

const wrapperWithMockStoreDraft = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <Provider store={storeDraft}>{children}</Provider>
  </QueryClientProvider>
);

const renderBPMNComponentWithDraft = (props = {}) => {
  return render(<ProcessCreateEdit {...defaultPropsBPMN} {...props} />, { wrapper : wrapperWithMockStoreDraft});
};


describe("ProcessCreateEdit test suite for BPM Subflow test cases", () => {
  beforeEach(() => {
    useParams.mockReturnValue({
      processKey: "test-process-key",
      step: "edit",
    });
    // Mock useQuery success response
    jest.spyOn(require("react-query"), "useQuery").mockImplementation(() => ({
      isLoading: false,
      data: {
        data: mockstate.process.processData, // Use the same data from mockstate
      },
      error: null,
    }));
  });

  test("displays Draft status when process is not published", () => {
    renderBPMNComponent();
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  test("renders save button with correct data-testid", () => {
    renderBPMNComponent();
    const saveButton = screen.getByTestId("save-bpmn-layout");
    expect(saveButton).toBeInTheDocument();
  });

  test("save button is initially disabled when workflow is not changed", () => {
    renderBPMNComponent();
    const saveButton = screen.getByTestId("save-bpmn-layout");
    expect(saveButton).toBeDisabled();
  });

  test("save button is disabled when process is published", () => {
    renderBPMNComponentWithPublished();
    const saveButton = screen.getByTestId("save-bpmn-layout");
    expect(saveButton).toBeDisabled();
  });

  test("save button is disabled during saving process", () => {
    renderBPMNComponent();
    const saveButton = screen.getByTestId("save-bpmn-layout");
    fireEvent.click(saveButton);
    expect(saveButton).toBeDisabled();
  });
});

describe("ProcessCreateEdit When save button is enabled", () => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: mockStateDraft
  });
  beforeEach(() => {
    useParams.mockReturnValue({
      processKey: 'test-process-key',
      step: 'edit'
    });

    jest.spyOn(require("react-query"), "useQuery").mockImplementation(() => ({
      isLoading: false,
      data: {
        data: mockStateDraft.process.processData
      },
      error: null
    }));
  });

  
  test("save button should be enabled and flow to be saved on CREATE mode",async () => {
    // useParams.mockReturnValue({
    //   processKey: 'test-process-key',
    //   step: 'create'
    // });
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    );

    render(
      <ProcessCreateEdit 
        type={defaultPropsBPMN.type} 
        Process={defaultPropsBPMN.Process}
      />, 
      { wrapper }
    );

    // Trigger workflow change
    const bpmnEditor = screen.getByTestId("bpmn-editor");
    fireEvent.click(bpmnEditor); // This should trigger onChange and set isWorkflowChanged to true
    const saveButton = screen.getByTestId("save-bpmn-layout");
    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent("Save BPMN");
    
    await userEvent.click(saveButton);
  });
  
});


describe("ProcessCreateEdit Save flow operations on process CREATE", () => {
  let mockDispatch = jest.fn();

  beforeEach(() => {
    useParams.mockReturnValue({
      processKey: 'test-process-key',
      step: 'create'
    });
    jest.spyOn(require("react-query"), "useQuery").mockImplementation(() => ({
      isLoading: false,
      data: {
        data: mockStateDraft.process.processData
      },
      error: null
    }));

    useDispatch.mockReturnValue(mockDispatch);

  });

  test("save button should be enabled and flow to be saved on CREATE mode",async () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: mockStateDraft
    });
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    );

    render(
      <ProcessCreateEdit 
        type={defaultPropsBPMN.type} 
        Process={defaultPropsBPMN.Process}
      />, 
      { wrapper }
    );

    // Trigger workflow change
    const bpmnEditor = screen.getByTestId("bpmn-editor");
    fireEvent.click(bpmnEditor); // This should trigger onChange and set isWorkflowChanged to true

    // Get the save button
    const saveButton = screen.getByTestId("save-bpmn-layout");
    // Verify button is enabled
    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent("Save BPMN");
    await userEvent.click(saveButton);
  });

});


describe('Check process PUBLISH button click', () => {
  let queryClient ;
  beforeEach(() => {
      useParams.mockReturnValue({
        processKey: 'test-process-key',
        step: 'create'
      });
      jest.spyOn(require("react-query"), "useQuery").mockImplementation(() => ({
        isLoading: false,
        data: {
          data: mockStateDraft.process.processData
        },
        error: null
      }));
      useDispatch.mockReturnValue(jest.fn());
      queryClient = new QueryClient();
  });

  afterEach(() => {
    jest.clearAllMocks();  // Clears all mock calls and instances
    jest.restoreAllMocks(); // Restores original implementations of spied methods
  });


  test('should call getModalContent with modalType "publish" and CREATE mode', async () => {
    // renderBPMNComponent();
    const mstore = configureStore({
      reducer: rootReducer,
      preloadedState: mockStateDraft
    });
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={mstore}>{children}</Provider>
      </QueryClientProvider>
    );

    render(
      <ProcessCreateEdit 
        type={defaultPropsBPMN.type} 
        Process={defaultPropsBPMN.Process}
      />, 
      { wrapper }
    );

    const bpmnEditor = screen.getByTestId("bpmn-editor");
    fireEvent.click(bpmnEditor); // This should trigger onChange and set isWorkflowChanged to true
    const publishBtn = screen.getByTestId("handle-publish-testid");
    fireEvent.click(publishBtn); 
    const confirmModalActionBtn = screen.getByTestId("Confirm-button");
    expect(confirmModalActionBtn).toBeInTheDocument();
    await act (async () => {
      fireEvent.click(confirmModalActionBtn);
    });
  });


  test('should call getModalContent with modalType "publish" and EDIT mode', async () => {
    useParams.mockReturnValue({
      processKey: 'test-process-key',
      step: 'edit'
    });
    // renderBPMNComponent();
    const mstore = configureStore({
      reducer: rootReducer,
      preloadedState: mockStateDraft
    });
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <Provider store={mstore}>{children}</Provider>
      </QueryClientProvider>
    );

    render(
      <ProcessCreateEdit 
        type={defaultPropsBPMN.type} 
        Process={defaultPropsBPMN.Process}
      />, 
      { wrapper }
    );

    const bpmnEditor = screen.getByTestId("bpmn-editor");
    fireEvent.click(bpmnEditor); 
    const publishBtn = screen.getByTestId("handle-publish-testid");
    expect(publishBtn).toBeInTheDocument();
    fireEvent.click(publishBtn); 
    const confirmModalActionBtn = screen.getByTestId("Confirm-button");
    expect(confirmModalActionBtn).toBeInTheDocument();
    await act (async () => {
      fireEvent.click(confirmModalActionBtn);
    });
  });
});


describe('Check process UNPUBLISH button click', () => {
  beforeEach(() => {
      useParams.mockReturnValue({
        processKey: 'test-process-key',
        step: 'edit'
      });
      jest.spyOn(require("react-query"), "useQuery").mockImplementation(() => ({
        isLoading: false,
        data: {
          data: mockStateDraft.process.processData
        },
        error: null
      }));
      useDispatch.mockReturnValue(jest.fn());
  });

  test('should call "unpublish" button in and EDIT mode', async () => {
    renderBPMNComponentWithPublished();

    const bpmnEditor = screen.getByTestId("bpmn-editor");
    fireEvent.click(bpmnEditor); // This should trigger onChange and set isWorkflowChanged to true
    const publishBtn = screen.getByTestId("handle-unpublish-testid");
    expect(publishBtn).toBeInTheDocument();
    fireEvent.click(publishBtn); 
    const confirmModalActionBtn = screen.getByTestId("Confirm-button");
    expect(confirmModalActionBtn).toBeInTheDocument();
    await act (async () => {
      fireEvent.click(confirmModalActionBtn);
    });
  });
});


describe("History modal working in process ", () => {
  let mockDispatch = jest.fn();
  beforeEach(() => {
      useParams.mockReturnValue({
        processKey: 'test-process-key',
        step: 'create'
      });
      jest.spyOn(require("react-query"), "useQuery").mockImplementation(() => ({
        isLoading: false,
        data: {
          data: mockStateDraft.process.processData
        },
        error: null
      }));
      useDispatch.mockReturnValue(mockDispatch);
  });
  test('should not show history button on CREATE mode', async () => {
    renderBPMNComponent();
    const historyBtn = screen.queryByTestId("bpmn-history-button-testid");
    expect(historyBtn).not.toBeInTheDocument();
  });

  test('should show history button on EDIT mode', async () => {
    useParams.mockReturnValue({
      processKey: 'test-process-key',
      step: 'edit'
    });
    renderBPMNComponent();
    const historyBtn = screen.queryByTestId("bpmn-history-button-testid");
    expect(historyBtn).toBeInTheDocument();
  });


  test('should click history button and open on EDIT mode', async () => {
    useParams.mockReturnValue({
      processKey: 'test-process-key',
      step: 'edit'
    });
    renderBPMNComponent();
    const historyBtn = screen.queryByTestId("bpmn-history-button-testid");
    expect(historyBtn).toBeInTheDocument();
    await userEvent.click(historyBtn);
  });
});


describe('Check process Discard Changes button click', () => {
  beforeEach(() => {
      useParams.mockReturnValue({
        processKey: 'test-process-key',
        step: 'create'
      });
      jest.spyOn(require("react-query"), "useQuery").mockImplementation(() => ({
        isLoading: false,
        data: {
          data: mockStateDraft.process.processData
        },
        error: null
      }));
      useDispatch.mockReturnValue(jest.fn());
  });

  test('should call modalType "discard" and CREATE mode', async () => {
    renderBPMNComponent();

    const bpmnEditor = screen.getByTestId("bpmn-editor");
    fireEvent.click(bpmnEditor); 
    const discardBtn = screen.getByTestId("discard-bpmn-changes-testid");
    fireEvent.click(discardBtn); 
    const confirmModalActionBtn = screen.getByTestId("Confirm-button");
    expect(confirmModalActionBtn).toBeInTheDocument();
    await act (async () => {
      fireEvent.click(confirmModalActionBtn);
    });
  });

});


describe("Action modal working in process ", () => {
  let mockDispatch = jest.fn();
  beforeEach(() => {
      useParams.mockReturnValue({
        processKey: 'test-process-key',
        step: 'create'
      });
      jest.spyOn(require("react-query"), "useQuery").mockImplementation(() => ({
        isLoading: false,
        data: {
          data: mockStateDraft.process.processData
        },
        error: null
      }));
      useDispatch.mockReturnValue(mockDispatch);
  });
  test('should show action button on CREATE mode', async () => {
    renderBPMNComponent();
    const actionBtn = screen.queryByTestId("designer-action-testid");
    expect(actionBtn).toBeInTheDocument();
  });

  test('should show action button on EDIT mode', async () => {
    useParams.mockReturnValue({
      processKey: 'test-process-key',
      step: 'edit'
    });
    renderBPMNComponent();
    const actionBtn = screen.queryByTestId("designer-action-testid");
    expect(actionBtn).toBeInTheDocument();
  });

  test('should click history button and open on EDIT mode', async () => {
    useParams.mockReturnValue({
      processKey: 'test-process-key',
      step: 'edit'
    });
    renderBPMNComponent();
    const actionBtn = screen.queryByTestId("designer-action-testid");
    expect(actionBtn).toBeInTheDocument();
    await userEvent.click(actionBtn);
    const actionModal = screen.queryByTestId("action-modal");
    expect(actionModal).toBeInTheDocument();
    const actionModalCloseBtn = screen.getByTestId("action-modal-close");
    expect(actionModalCloseBtn).toBeInTheDocument();
    await userEvent.click(actionModalCloseBtn);
  });
});