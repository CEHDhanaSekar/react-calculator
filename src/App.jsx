import { useReducer } from "react"
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT : 'add-digit',
  CLEAR : 'clear',
  DELETE_DIGIT : 'delete-digit',
  CHOOSE_OPERATION : 'choose-operation',
  EVALUATE : 'evaluate',
}

function reducer(state, { type,payload }) {

  switch(type) {
    case ACTIONS.ADD_DIGIT : 
      if( payload.digit === "0" && state.currentOperand === "0" ) {
        return state
      }
      if( payload.digit === "." && state.currentOperand.includes(".") ) {
        return state
      }
      if(state.overwrite){
        return {
          ...state,
          overwrite : false,
          currentOperand : payload.digit,
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.DELETE_DIGIT :
      if(state.overwrite){
        return {
          ...state,
          overwrite : false,
          currentOperand : null,
        }
      }
      if(state.currentOperand == null ) return state
      if(state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand : null,
        }
      }
      return {
        ...state,
        currentOperand : state.currentOperand.slice(0,-1),
      }

    case ACTIONS.CHOOSE_OPERATION :
      if(state.currentOperand == null && state.previousOperand == null){
        return state;
      }
      if(state.previousOperand == null){
        return {
          ...state,
          previousOperand : state.currentOperand,
          operation : payload.operation,
          currentOperand : null,
        }
      }
      if(state.currentOperand == null){
        return {
          ...state,
          operation : payload.operation,
        }
      }
      return {
        ...state,
        previousOperand : evaluate(state),
        operation : payload.operation,
        currentOperand : null,
      }
    
    case ACTIONS.CLEAR : 
      return {};
      
    case ACTIONS.EVALUATE :
      if(state.currentOperand == null || state.previousOperand == null || state.operation == null) return state

      return {
        ...state,
        overwrite : true,
        currentOperand : evaluate(state),
        previousOperand : null,
        operation : null,
      }
    }
}

function evaluate({ currentOperand, previousOperand, operation }){
  
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  let calc = ""

  if(isNaN(prev) || isNaN(current)) return ""

  switch(operation){
    case '÷':
      calc = prev / current
      break;
    case '*':
      calc = prev * current
      break;
    case '+':
      calc = prev + current
      break;
    case '-':
      calc = prev - current
      break;
  }

  return calc
}

export default function App() {

  const [{ currentOperand, previousOperand ,operation }, dispatch] = useReducer(reducer,{});

  return (
    <>
      <div id="calculator-grid">
        <div id="calculation-result">
          <div className="previous-operand">{previousOperand} {operation}</div>
          <div className="current-operand">{currentOperand}</div>
        </div>
        <button className="span-two" onClick={ () => dispatch({ type : ACTIONS.CLEAR, payload : "" }) }>AC</button>
        <button onClick={ () => dispatch({ type : ACTIONS.DELETE_DIGIT }) }>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch}/>
        <DigitButton digit="1" dispatch={dispatch} /> 
        <DigitButton digit="2" dispatch={dispatch} /> 
        <DigitButton digit="3" dispatch={dispatch} /> 
        <OperationButton operation="*" dispatch={dispatch} /> 
        <DigitButton digit="4" dispatch={dispatch} /> 
        <DigitButton digit="5" dispatch={dispatch} /> 
        <DigitButton digit="6" dispatch={dispatch} /> 
        <OperationButton operation="+" dispatch={dispatch} /> 
        <DigitButton digit="7" dispatch={dispatch} /> 
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} /> 
        <OperationButton operation="-" dispatch={dispatch} />  
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />  
        <button className="span-two" onClick={ () => dispatch({ type : ACTIONS.EVALUATE }) }>=</button>
      </div>
    </>
  )
}
