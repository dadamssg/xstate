import * as fs from 'fs';
import * as path from 'path';
import * as pkgUp from 'pkg-up';

import { toMachine } from '../src/scxml';
import { interpret } from '../src/interpreter';
import { State } from '../src';
import { getStateNodes } from '../src/stateUtils';
import { MachineNode } from '../src/MachineNode';

const TEST_FRAMEWORK = path.dirname(pkgUp.sync({
  cwd: require.resolve('@scion-scxml/test-framework')
}) as string);

// @ts-ignore
const testGroups = {
  actionSend: [
    'send1',
    'send2',
    'send3',
    'send4',
    'send4b',
    'send7',
    'send7b',
    'send8',
    'send8b',
    'send9'
  ],
  assign: [
    // 'assign_invalid', // TODO: handle error.execution event
    'assign_obj_literal'
  ],
  'assign-current-small-step': ['test0', 'test1', 'test2', 'test3', 'test4'],
  basic: ['basic0', 'basic1', 'basic2'],
  'cond-js': ['test0', 'test1', 'test2', 'TestConditionalTransition'],
  data: [
    // 'data_invalid',
    'data_obj_literal'
  ],
  'default-initial-state': ['initial1', 'initial2'],
  delayedSend: ['send1', 'send2', 'send3'],
  documentOrder: ['documentOrder0'],
  error: [
    // 'error', // not implemented
  ],
  forEach: [
    // 'test1', // not implemented
  ],
  hierarchy: ['hier0', 'hier1', 'hier2'],
  'hierarchy+documentOrder': ['test0', 'test1'],
  history: [
    'history0',
    'history1',
    'history2',
    'history3',
    'history4',
    'history4b',
    'history5',
    'history6'
  ],
  'if-else': [
    // 'test0', // not implemented
  ],
  in: [
    // 'TestInPredicate', // conversion of In() predicate not implemented yet
  ],
  'internal-transitions': ['test0', 'test1'],
  misc: ['deep-initial'],
  'more-parallel': [
    'test0',
    'test1',
    'test2',
    'test2b',
    'test3',
    'test3b',
    'test4',
    'test5',
    'test6',
    'test6b',
    'test7',
    'test8',
    'test9',
    'test10',
    'test10b'
  ],
  'multiple-events-per-transition': [
    // 'test1'
  ],
  parallel: ['test0', 'test1', 'test2', 'test3'],
  'parallel+interrupt': [
    'test0',
    'test1',
    'test2',
    'test3',
    'test4',
    'test5',
    'test6',
    'test7',
    'test7b',
    'test8',
    'test9',
    'test10',
    'test11',
    'test12',
    'test13',
    'test14',
    'test15',
    'test16',
    'test17',
    'test18',
    'test19',
    'test20',
    'test21',
    'test21b',
    'test21c',
    'test22',
    'test23',
    'test24',
    'test25',
    'test27',
    'test28',
    'test29',
    'test30',
    'test31'
  ],
  // script: ['test0', 'test1', 'test2'], // <script/> conversion not implemented
  // 'script-src': ['test0', 'test1', 'test2', 'test3'], // <script/> conversion not implemented
  'scxml-prefix-event-name-matching': [
    'star0'
    // prefix event matching not implemented yet
    // 'test0',
    // 'test1'
  ],
  // 'send-data': ['send1'],
  // 'send-idlocation': ['test0'],
  // 'send-internal': ['test0'],
  'targetless-transition': ['test0', 'test1', 'test2', 'test3'],
  'w3c-ecma': [
    'test144.txml',
    // 'test147.txml', // <if> not implemented yet
    // 'test148.txml', // <if> not implemented yet
    'test149.txml',
    // 'test150.txml', // <foreach> not implemented yet
    // 'test151.txml', // <foreach> not implemented yet
    // 'test152.txml', // <foreach> not implemented yet
    'test153.txml',
    // 'test155.txml', // <foreach> not implemented yet
    // 'test156.txml', // <foreach> not implemented yet
    'test158.txml',
    // 'test159.txml', // different error handling
    'test172.txml',
    'test173.txml',
    'test174.txml',
    'test175.txml',
    'test176.txml',
    // 'test179.txml', // conversion of <content> in <sens> not implemented yet
    // 'test183.txml', idlocation not implemented yet
    'test185.txml',
    // 'test186.txml', // not sure yet why
    'test187.txml',
    'test189.txml',
    // 'test190.txml', // _sessionid not yet available for expressions
    'test191.txml',
    // 'test192.txml', // conversion of #_invokeid not implemented yet
    'test193.txml',
    // 'test194.txml', // illegal target for <send> causes the event error.execution to be raised
    // 'test198.txml', // origintype not implemented yet
    // 'test199.txml', // invalid send type results in error.execution
    'test200.txml',
    'test201.txml',
    'test205.txml',
    'test207.txml',
    'test208.txml',
    'test210.txml',
    // 'test215.txml', // <invoke typeexpr="...">
    // 'test216.txml', // <invoke srcexpr="...">
    // 'test220.txml', // done.invoke used as inexact event descriptor
    // 'test223.txml', // idlocation not implemented yet
    // 'test224.txml', // done.invoke used as inexact event descriptor
    // 'test225.txml', // unique invokeids generated at invoke time
    // 'test226.txml', // <invoke src="...">
    // 'test228.txml', // done.invoke used as inexact event descriptor + _event.invokeid not implemented yet
    'test229.txml',
    // 'test230.txml', // done.invoke used as inexact event descriptor + SCXML _event properties not implemented yet
    // 'test232.txml', // done.invoke used as inexact event descriptor
    // 'test233.txml', // <finalize> not implemented yet
    // 'test234.txml', // <finalize> not implemented yet
    'test235.txml',
    // 'test236.txml', // done.invoke used as inexact event descriptor
    // 'test237.txml', // done.invoke used as inexact event descriptor
    // 'test239.txml', // done.invoke used as inexact event descriptor
    // 'test240.txml', // conversion of namelist not implemented yet
    // 'test241.txml', // conversion of namelist not implemented yet
    // 'test242.txml', // <invoke src="...">
    // 'test243.txml', // conversion of <param> in <scxml> not implemented yet
    // 'test244.txml', // conversion of namelist not implemented yet
    // 'test245.txml', // conversion of namelist not implemented yet
    // 'test247.txml', // done.invoke used as inexact event descriptor
    // 'test250.txml', // this is a manual test - we could test it by snapshoting logged valued
    // 'test252.txml', // done.invoke used as inexact event descriptor
    // 'test253.txml', // _event.origintype not implemented yet
    // 'test276.txml', // <invoke src="...">
    // 'test277.txml', // illegal expression in datamodel creates unbound variable
    // 'test278.txml', // non-root datamodel with early binding not implemented yet
    // 'test279.txml', // non-root datamodel with early binding not implemented yet
    // 'test280.txml', // non-root datamodel with late binding not implemented yet
    // 'test286.txml', // error.execution when evaluating assign
    'test287.txml',
    // 'test294.txml', // conversion of <donedata> not implemented yet
    // 'test298.txml', // error.execution when evaluating donedata
    // 'test302.txml', // conversion of <script> not implemented yet
    // 'test303-1.txml', // conversion of <script> not implemented yet
    // 'test303-2.txml', // conversion of <script> not implemented yet
    // 'test303.txml', // conversion of <script> not implemented yet
    // 'test304.txml', // conversion of <script> not implemented yet
    // 'test307.txml', // non-root datamodel with late binding not implemented yet
    // 'test309.txml', // error in cond expression being treated as false
    // 'test310.txml', // conversion of In() predicate not implemented yet
    // 'test311.txml', // error.execution when evaluating assign
    // 'test312.txml', // error.execution when evaluating assign
    // 'test313.txml', // error.execution when evaluating assign
    // 'test314.txml', // error.execution when evaluating assign
    'test318.txml',
    // 'test319.txml', // SCXML has no init event, so _event stays unbound in onentry of initial state
    // 'test321.txml', // _sessionid not yet available for expressions
    // 'test322.txml', // _sessionid not yet available for expressions
    // 'test323.txml', // _name not yet available for expressions
    // 'test324.txml', // _name not yet available for expressions
    // 'test325.txml', // _ioprocessors not yet available for expressions
    // 'test326.txml', // _ioprocessors not yet available for expressions
    // 'test329.txml', // system variables can't be modified, we don't keep them in datamodel, so it might be hard to run this test
    // 'test330.txml', // SCXML _event properties not implemented yet
    // 'test331.txml', // _event.type not implemented yet correctly
    // 'test332.txml', // idlocation not implemented yet
    'test333.txml',
    'test335.txml',
    'test336.txml',
    'test337.txml',
    // 'test338.txml', // _event.invokeid not implemented yet
    'test339.txml',
    'test342.txml',
    // 'test343.txml', // error.execution when evaluating donedata
    // 'test344.txml', // error in cond expression being treated as false and raises error.execution
    // 'test346.txml', // system variables can't be modified, we don't keep them in datamodel, so it might be hard to run this test
    // 'test347.txml', // done.invoke used as inexact event descriptor
    'test348.txml',
    'test349.txml',
    // 'test350.txml', // _sessionid not yet available for expressions
    // 'test351.txml', // _event.sendid not implemented yet
    // 'test352.txml', // _event.origintype not implemented yet
    // 'test354.txml', // conversion of namelist not implemented yet
    'test355.txml',
    // 'test364.txml', // deep initial states not implemented yet
    // 'test372.txml', // microstep not implemented correctly
    'test375.txml',
    // 'test376.txml', // executable blocks not implemented
    'test377.txml',
    // 'test378.txml', // executable blocks not implemented
    'test387.txml',
    // 'test388.txml', // deep initial states not implemented yet
    'test396.txml',
    // 'test399.txml', // inexact prefix event matching not implemented
    // 'test401.txml', // error.execution when evaluating assign
    // 'test402.txml', // error.execution when evaluating assign + inexact prefix event matching not implemented
    'test403a.txml',
    'test403b.txml',
    'test403c.txml',
    'test404.txml',
    'test405.txml',
    'test406.txml',
    'test407.txml',
    'test409.txml',
    // 'test411.txml', // conversion of In() predicate not implemented yet + <if> not implemented yet + microstep not implemented correctly
    // 'test412.txml', // initial transitions with executable content not implemented yet
    // 'test413.txml', // deep initial states not implemented yet
    'test416.txml',
    'test417.txml',
    'test419.txml',
    'test421.txml',
    // 'test422.txml', conversion of type-less <invoke> not implemented yet
    'test423.txml',
    // 'test436.txml', // conversion of In() predicate not implemented yet + null datamodel not implemented yet
    // 'test444.txml', // datamodel being mutated in cond's expression 😱
    'test445.txml',
    // 'test446.txml', // conversion of <data src="..."> not implemented yet
    // 'test448.txml', // nested datamodels not implemented yet
    'test449.txml',
    // 'test451.txml', // conversion of In() predicate not implemented yet
    // 'test452.txml', // conversion of <script> not implemented yet
    'test453.txml',
    // 'test456.txml', // conversion of <script> not implemented yet
    // 'test457.txml', // <foreach> not implemented yet
    // 'test459.txml', // <foreach> not implemented yet + <if> not implemented yet
    // 'test460.txml', // <foreach> not implemented yet
    // 'test487.txml', // error.execution when evaluating assign
    // 'test488.txml', // error.execution when evaluating param
    'test495.txml',
    // 'test496.txml', // error.communication not implemented yet
    // 'test500.txml', // _ioprocessors not yet available for expressions
    // 'test501.txml', // _ioprocessors not yet available for expressions
    'test503.txml',
    'test504.txml',
    'test505.txml',
    'test506.txml',
    // 'test509.txml', // Basic HTTP Event I/O processor not implemented
    // 'test510.txml', // Basic HTTP Event I/O processor not implemented
    // 'test518.txml', // Basic HTTP Event I/O processor not implemented
    // 'test519.txml', // Basic HTTP Event I/O processor not implemented
    // 'test520.txml', // Basic HTTP Event I/O processor not implemented
    // 'test521.txml', // error.communication not implemented yet
    // 'test522.txml', // Basic HTTP Event I/O processor not implemented
    // 'test525.txml', // <foreach> not implemented yet
    // 'test527.txml', // conversion of <donedata> not implemented yet
    // 'test528.txml', // conversion of <donedata> not implemented yet + error.execution when evaluating donedata
    // 'test529.txml', // conversion of <donedata> not implemented yet
    // 'test530.txml', // done.invoke used as inexact event descriptor
    // 'test531.txml', // Basic HTTP Event I/O processor not implemented
    // 'test532.txml', // Basic HTTP Event I/O processor not implemented
    'test533.txml',
    // 'test534.txml', // Basic HTTP Event I/O processor not implemented
    // 'test550.txml', // non-root datamodel with early binding not implemented yet
    // 'test551.txml', // non-root datamodel with early binding not implemented yet
    // 'test552.txml', // conversion of <data src="..."> not implemented yet
    // 'test553.txml', // namelist not implemented yet + errored send not dispatching an event
    // 'test554.txml', // namelist not implemented yet + errored invoke cancelled
    // 'test557.txml', // conversion of <data src="..."> not implemented yet
    // 'test558.txml', // conversion of <data src="..."> not implemented yet
    'test560.txml',
    // 'test561.txml', // processor creates an ECMAScript DOM object _event.data when receiving XML in an event
    // 'test562.txml', // test that processor creates space normalized string in _event.data when receiving anything other than KVPs or XML in an event
    // 'test567.txml', // Basic HTTP Event I/O processor not implemented
    // 'test569.txml', // _ioprocessors not yet available for expressions
    'test570.txml'
    // 'test576.txml', // deep initial states not implemented yet
    // 'test577.txml', // Basic HTTP Event I/O processor not implemented
    // 'test578.txml', // conversion of <content> in <send> not implemented yet
    // 'test579.txml' // executable content in history states not implemented yet
    // 'test580.txml' // conversion of In() predicate not implemented yet
  ]
};

const overrides = {
  'assign-current-small-step': [
    // original using <script/> to manipulate datamodel
    'test0'
  ]
};

interface SCIONTest {
  initialConfiguration: string[];
  events: Array<{
    after?: number;
    event: { name: string };
    nextConfiguration: string[];
  }>;
}

const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

async function runW3TestToCompletion(machine: MachineNode): Promise<void> {
  await new Promise((resolve, reject) => {
    let nextState: State<any>;

    interpret(machine)
      .onTransition(state => {
        nextState = state;
      })
      .onDone(() => {
        if (nextState.value === 'pass') {
          resolve();
        } else {
          reject(new Error('Reached "fail" state.'));
        }
      })
      .start();
  });
}

type MachineStatus = 'success' | 'failed' | 'running';

async function runTestToCompletion(
  machine: MachineNode,
  test: SCIONTest
): Promise<void> {
  if (!test.events.length && test.initialConfiguration[0] === 'pass') {
    await runW3TestToCompletion(machine);
    return;
  }

  let status: MachineStatus = 'running';
  let nextState: State<any> = machine.initialState;

  const service = interpret(machine)
    .onTransition(state => {
      nextState = state;
    })
    .onDone(() => {
      status = nextState.value === 'fail' ? 'failed' : 'success';
    })
    .start(nextState);

  for (const { event, nextConfiguration, after } of test.events) {
    switch (status as MachineStatus) {
      case 'running':
        if (after) {
          await sleep(after);
        }
        service.send(event.name);
        const stateIds = getStateNodes(machine, nextState).map(
          stateNode => stateNode.id
        );

        expect(stateIds).toContain(nextConfiguration[0]);
        break;
      case 'success':
        return;
      case 'failed':
        throw new Error('Reached "fail" state.');
    }
  }
}

describe('scxml', () => {
  const testGroupKeys = Object.keys(testGroups);
  // const testGroupKeys = ['parallel+interrupt'];

  testGroupKeys.forEach(testGroupName => {
    const testNames = testGroups[testGroupName];
    // const testNames = ['test17'];

    testNames.forEach(testName => {
      const scxmlSource =
        overrides[testGroupName] &&
        overrides[testGroupName].indexOf(testName) !== -1
          ? `./fixtures/scxml/${testGroupName}/${testName}.scxml`
          : `${TEST_FRAMEWORK}/test/${testGroupName}/${testName}.scxml`;
      const scxmlDefinition = fs.readFileSync(
        path.resolve(__dirname, scxmlSource),
        { encoding: 'utf-8' }
      );
      const scxmlTest = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            `${TEST_FRAMEWORK}/test/${testGroupName}/${testName}.json`
          ),
          { encoding: 'utf-8' }
        )
      ) as SCIONTest;

      it(`${testGroupName}/${testName}`, async () => {
        const machine = toMachine(scxmlDefinition, {
          delimiter: '$'
        });

        try {
          await runTestToCompletion(machine, scxmlTest);
        } catch (e) {
          // console.log(testName);
          // console.dir(JSON.stringify(machine.config, null, 2));
          throw e;
        }
      });
    });
  });
});
