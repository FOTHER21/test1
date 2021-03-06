import Modeler from "bpmn-js/lib/Modeler";

import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import "../css/styles.css";
import $ from "jQuery";

import diagram from "../resources/modeling-api.bpmn";

const container = document.getElementById("container");

const modeler = new Modeler({
  container,
  keyboard: {
    bindTo: document
  },
  additionalModules: [propertiesPanelModule, propertiesProviderModule],
  propertiesPanel: {
    parent: "#properties-panel-parent"
  }
});
let canvas = null;
let moddle = null;
let modeling = null;
let bpmnFactory = null;
let elementRegistry = null;
let eventBus = null;
let elementFactory = null;

modeler
  .importXML(diagram)
  .then(({ warnings }) => {
    if (warnings.length) {
      console.log(warnings);
    }

    canvas = modeler.get("canvas");
    moddle = modeler.get("moddle");
    modeling = modeler.get("modeling");
    bpmnFactory = modeler.get("bpmnFactory");
    elementRegistry = modeler.get("elementRegistry");
    eventBus = modeler.get("eventBus");
    elementFactory = modeler.get("elementFactory");

    canvas.zoom("fit-viewport");
    console.log(diagram);

    // you may hook into any of the following events
    // var events = ["element.click", "element.dblclick"];

    // eventBus.on([...events], function (e) {
    //   // console.log(event, "on", e.element.id, e.gfx);
    //   const taskElement = elementRegistry.get(e.element.id);
    //   let taskBusinessObject = taskElement.businessObject;
    //   console.log(taskBusinessObject.name);
    // });

    const events = [
      // "commandStack.elements.create.postExecuted",
      // "commandStack.elements.delete.postExecuted",
      // "commandStack.elements.move.postExecuted",
      // "elements.changed",
      "elements.delete",
      "element.changed"
      // "element.click",
      // "element.dblclick"
    ];

    const events2 = [
      { event: "elements.delete", priority: 2000 },
      { event: "element.changed", priority: 1000 }
    ];

    events.forEach(function (event) {
      eventBus.on(event, function (e) {
        // e.element = the model element
        // e.gfx = the graphical element
        // console.log(event, e);
        const taskElement = elementRegistry.get(e.element.id);
        if (taskElement) {
          let taskBusinessObject = taskElement.businessObject;
          console.log(
            e.element.id + "??? ?????? ?????? ?????? ?????????.",
            taskBusinessObject,
            e.gfx
          );
        } else {
          console.log(e.element.id + "??? ?????? ?????????.");
        }
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

const showDebugData = function () {
  console.log("showDebugData");
};
const showElements = function () {
  console.log("showElements");
};

const doDebugFunction1 = () => {
  console.log(doDebugFunction1);
  /**
   *  bpmn-js??? ??? ??????????????? ?????? ??? modeler#get??? ????????????
   *  bpmn-js??? ?????? ????????? ????????? ??? ??? ??????.
   *
   * ??? ????????? ?????? ??? ????????? ????????? ??????.
   *
   * * ElementFactory: ????????? ????????? ????????? ?????????.
   * * ElementRegistry: ?????????????????? ?????? ????????? ????????? ?????? ???????????????
   * * Modeling: ?????????????????? ?????? ??????.
   *
   * ??? ????????? ???????????? ??? shape??? ????????? ?????????????????? ?????? ??? ?????? ?????? shape??? ????????????.
   */

  // (1) Get the modules
  // const elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) ?????? process??? start event ????????????
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // (3) ?????? diagram shape ??????
  const task = elementFactory.createShape({ type: "bpmn:Task" });

  // (4) diagram??? ?????? task ??????
  modeling.createShape(task, { x: 400, y: 500 }, process);

  // ?????? element registry??? ?????? ?????? task??? ????????? ????????????.
  console.log(elementRegistry.get(task.id)); // Shape { "type": "bpmn:Task", ... }

  // (5) ?????? task??? ???????????? start event task??? ??????
  modeling.connect(startEvent, task);
};
const doDebugFunction2 = () => {
  console.log("Business Objects");
  /**
   * Business object??? shape ?????? connection??? ?????? BPMN ??????
   * ????????? ???????????? ?????? ????????????.
   * element???`businessObject` ????????? ?????? ????????? ??? ??? ??????.
   * ?????? ?????? ????????? shape??? connecton?????? ???????????? ?????? ?????????.
   * ?????? ?????? ????????? ????????? ????????? ????????? ???????????? ???????????????
   * ????????? ?????? ?????????????????????.
   *
   * ?????? BPMN model??? ???????????? : https://github.com/bpmn-io/bpmn-moddle/blob/master/resources/bpmn/json/bpmn.json
   *
   * ??? ????????? ?????? ??? ?????? :
   *
   * * BpmnFactory: ?????? business object ??????
   * * ElementFactory: ?????? shape, connection ??????
   * * ElementRegistry: diagrma??? ?????? shape, connection??? ?????????
   * * Modeling: modeling??? ?????? main module
   *
   * ??? ????????? ????????????
   * shape??? ???????????? ?????? business object??? ?????? -->
   * ?????? ??? diagram??? ?????? --> ????????? shape??? ??????
   */

  // (1) ?????? ????????????
  // const bpmnFactory = modeler.get("bpmnFactory"),
  //   elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) ????????? process??? start event ????????????
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // start event??? business object??? ????????? ??? ??? ??????
  console.log(startEvent.businessObject); // { "$type": "bpmn:StartEvent", ... }

  // (3) ???????????????  business object??? ???????????? ?????? element factory??? ???????????? ?????? BPMN factory??? ???????????? ??????
  const taskBusinessObject = bpmnFactory.create("bpmn:Task", {
    id: "Task_11",
    name: "Task"
  });

  // (4) ????????? ?????? business object??? ???????????? ?????? diagram shape ??????
  const task = elementFactory.createShape({
    type: "bpmn:Task",
    businessObject: taskBusinessObject
  });

  // (5) diagram??? ?????? task ??????
  modeling.createShape(task, { x: 400, y: 100 }, process);

  // `id` property??? ???????????? elementRegistry?????? ?????? task ????????? ?????????
  console.log(elementRegistry.get("Task_1")); // Shape { "type": "bpmn:Task", ... }
};
const doDebugFunction3 = () => {
  console.log("Creating Shapes");
  /**
   * ?????? ????????? shape??? ????????? ??????.
   *
   * ??? ????????? ????????? ?????? :
   *
   * * BpmnFactory: business object ??????
   * * ElementFactory: shape, connection ??????
   * * ElementRegistry: diagram??? shape, connection ?????????
   * * Modeling: modeling main ??????
   *
   * ??? ????????? ???????????? BoundaryEvent??? SubProcess??? ?????????
   * shape??? ?????????.
   */

  // (1) module ????????????
  // const bpmnFactory = modeler.get("bpmnFactory"),
  //   elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) ????????? process??? start event ????????????
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // (3) service task shape ??????
  const serviceTask = elementFactory.createShape({ type: "bpmn:ServiceTask" });

  // (4) `appendShape`??? ???????????? diagram??? ?????? service task
  // shape??? ??????, ?????? shape??? ??????
  modeling.appendShape(startEvent, serviceTask, { x: 400, y: 100 }, process);

  // (5) boundary event shape ??????
  const boundaryEvent = elementFactory.createShape({
    type: "bpmn:BoundaryEvent"
  });

  // (6) ?????? boundary event??? service taks??? ???????????? diagram??? ??????
  modeling.createShape(boundaryEvent, { x: 400, y: 140 }, serviceTask, {
    attach: true
  });

  // (7) event sub process business object ??????
  const eventSubProcessBusinessObject = bpmnFactory.create("bpmn:SubProcess", {
    triggeredByEvent: true,
    isExpanded: true
  });

  // (8) SubProcess shape??????, ??????(7)??? ????????? event sub process business object ??????
  const eventSubProcess = elementFactory.createShape({
    type: "bpmn:SubProcess",
    businessObject: eventSubProcessBusinessObject,
    isExpanded: true
  });

  // (9) sub process??? diagram??? ??????
  modeling.createShape(eventSubProcess, { x: 300, y: 400 }, process);

  // (10) ????????? ????????? ??????????????? `eventDefinitionType`
  // ???????????? timer start event ??????
  const timerStartEvent = elementFactory.createShape({
    type: "bpmn:StartEvent",
    eventDefinitionType: "bpmn:TimerEventDefinition"
  });

  // (11) event sub process??? ???????????? ????????? ????????? ?????????
  // ???????????? ???????????? diagram??? ?????? timer start event ??????
  // ?????? ?????? ??????
  // Add the new timer start event to the diagram specifying the event sub process as the target
  // so the event will be a child of it
  modeling.createShape(timerStartEvent, { x: 200, y: 400 }, eventSubProcess);

  // (12) width??? height??? ???????????? ?????? group shape ??????
  const group = elementFactory.createShape({
    type: "bpmn:Group",
    width: 400,
    height: 200
  });

  // (13) ?????? group??? diagram??? ??????
  modeling.createShape(group, { x: 325, y: 100 }, process);

  // (14) ???????????? x, y??? ???????????? shape 2??? ??????
  const messageStartEvent = elementFactory.createShape({
    type: "bpmn:StartEvent",
    eventDefinitionType: "bpmn:MessageEventDefinition",
    x: 0,
    y: 22
  });

  const userTask = elementFactory.createShape({
    type: "bpmn:UserTask",
    x: 100,
    y: 0
  });

  // (15) diagram??? ?????? shape ??????
  modeling.createElements(
    [messageStartEvent, userTask],
    { x: 300, y: 600 },
    process
  );
};
const doDebugFunction4 = () => {
  console.log("Connecting Shapes");
  /**
   * ?????? ?????? shape??? ???????????? ?????? ???????????? ??????.
   *
   * The modules used in this example are:
   *
   * * ElementFactory: shape, connection ??????
   * * ElementRegistry: diagram??? shape, connection ?????????
   * * Modeling: modeling main ??????
   
  * shape??? connection??? ????????? ????????? ????????? ?????? ??????
  * We will use these modules to create shapes and connect them on two different ways.
  */

  // (1) ?????? ????????????
  // const elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) Get the existing process and the start event
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // (3) Create a task shape
  const task = elementFactory.createShape({ type: "bpmn:Task" });

  // (4) Add the new service task shape to the diagram
  modeling.createShape(task, { x: 400, y: 100 }, process);

  // (5) Connect the existing start event to new task using `connect`
  modeling.connect(startEvent, task);

  // (6) Create a end event shape
  const endEvent = elementFactory.createShape({ type: "bpmn:EndEvent" });

  // (7) Add the new end event shape to the diagram
  modeling.createShape(endEvent, { x: 600, y: 100 }, process);

  // (8) Create a new sequence flow connection that connects the task to the end event
  modeling.createConnection(
    task,
    endEvent,
    { type: "bpmn:SequenceFlow" },
    process
  );
};
const doDebugFunction5 = () => {
  /**
   * ???????????? ??????????????? ????????????. ????????? ?????? ?????? ??????
   * ????????? ??????:
   *
   * * ElementFactory: shape, connection ??????
   * * ElementRegistry: diagram??? shape, connection ?????????
   * * Modeling: modeling main ??????
   *
   * ????????? ????????? ???????????? ???????????? ????????? ?????????????????? ???????????? (????????? ??????????????? ???????????? ??????),
   * ????????? ????????? ????????? ????????? ???????????? ???????????? ???????????????.
   */

  // (1) ?????? ????????????
  // const elementFactory = modeler.get("elementFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) ????????? process??? start event ????????????
  const process = elementRegistry.get("Process_1"),
    startEvent = elementRegistry.get("StartEvent_1");

  // (3) `createParticipantShape`??? ???????????? ?????? participant shape ??????
  const participant = elementFactory.createParticipantShape({
    type: "bpmn:Participant"
  });

  // (4) ??????????????? ???????????? ??????????????? diagram??? ?????? participant ??????
  // Add the new participant to the diagram turning the process into a collaboration
  modeling.createShape(participant, { x: 400, y: 400 }, process);

  // ?????? start event??? ?????? participant??? child ?????????.
  console.log(startEvent.parent); // Shape { "type": "bpmn:Participant", ... }

  // (5) lane ??????
  const lane = modeling.addLane(participant, "bottom");

  // (6) 2?????? nested lane ??????
  modeling.splitLane(lane, 2);

  // (7) ????????? ?????? participant shape ??????
  const collapsedParticipant = elementFactory.createParticipantShape({
    type: "bpmn:Participant",
    isExpanded: false
  });

  // (8) diagram??? participant ??????
  modeling.createShape(collapsedParticipant, { x: 300, y: 500 }, process);

  // (9) message flow??? ?????? 2?????? participan ??????
  // Connect the two participants through a message flow
  modeling.connect(collapsedParticipant, participant);
};
const doDebugFunction6 = () => {
  console.log("Edting Elements");
  /**
   * element??? ???????????? ????????? ??????
   *
   * The modules used in this example are:
   *
   * *
   * * BpmnFactory: ?????? business objects.
   * * ElementRegistry: diagram??? shape, connection ?????????
   * * Modeling: modeling main ??????
   *
   */

  // (1) ?????? ????????????
  // const bpmnFactory = modeler.get("bpmnFactory"),
  //   elementRegistry = modeler.get("elementRegistry"),
  //   modeling = modeler.get("modeling");

  // (2) shape ????????????
  const startEvent = elementRegistry.get("StartEvent_1"),
    exclusiveGateway = elementRegistry.get("ExclusiveGateway_1"),
    sequenceFlow = elementRegistry.get("SequenceFlow_3"),
    task = elementRegistry.get("Task_1");

  // (3) `updateProperties`??? ???????????? start event??? `name` ??????
  modeling.updateProperties(startEvent, { name: "Foo" });

  // (4) gateway??? `defaultFlow` ?????? ??????
  modeling.updateProperties(exclusiveGateway, {
    default: sequenceFlow.businessObject
  });

  // (5) task??? multi-instance(??????????????????)??? ??????
  const multiInstanceLoopCharacteristics = bpmnFactory.create(
    "bpmn:MultiInstanceLoopCharacteristics"
  );

  modeling.updateProperties(task, {
    loopCharacteristics: multiInstanceLoopCharacteristics
  });
};

$(function () {
  $(document).on("click", "#js-debug-value", showDebugData);
  $(document).on("click", "#js-debug-value2", showElements);
  $(document).on("click", "#js-debug1", doDebugFunction1);
  $(document).on("click", "#js-debug2", doDebugFunction2);
  $(document).on("click", "#js-debug3", doDebugFunction3);
  $(document).on("click", "#js-debug4", doDebugFunction4);
  $(document).on("click", "#js-debug5", doDebugFunction5);
  $(document).on("click", "#js-debug6", doDebugFunction6);
});
