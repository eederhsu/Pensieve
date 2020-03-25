import { combineReducers } from 'redux';
import {
  MOUNT_USERINFO,
  SET_MESSAGE_SINGLECLOSE,
  SET_MESSAGE_BOOLEAN,
  SET_FETCHFLAGS,
  SET_UNITCURRENT,
  SET_TOKENSTATUS,
  UPDATE_NOUNSBASIC,
  UPDATE_USERSBASIC
} from '../types/typesGeneral.js';
import {
  SET_INDEXLISTS,
  SET_BELONGSBYTYPE,
  SUBMIT_FEEDASSIGN
} from '../types/typesWithin.js';
import {
  SET_UNITVIEW,
  UNIT_SUBMITTING_SWITCH
} from '../types/typesUnit.js';
import {
  initGlobal,
  initNouns,
  initUsers
} from '../states/states.js';
import {initUnit} from '../states/statesUnit.js';
import {
  initWithin,
  initCosmic,
  initAround
} from '../states/statesWithin.js'

//this is a temp management, in case one day we will seperate the reducer like the initstate
const initialGeneral = Object.assign({}, initGlobal, initWithin, initCosmic, initAround, initUnit, initNouns, initUsers);

function pageWithin(state = initialGeneral, action){
  switch (action.type) {
    case MOUNT_USERINFO:
      return Object.assign({}, state, {
        userInfo: action.userInfo
      })
      break;
    case SET_MESSAGE_SINGLECLOSE:
      return Object.assign({}, state, {
        messageSingleClose: action.messageSingleClose
      })
      break;
    case SET_MESSAGE_BOOLEAN:
      return Object.assign({}, state, {
        messageBoolean: action.messageBoolean
      })
      break;
    case SET_FETCHFLAGS:
      return Object.assign({}, state, {...action.flags}) //there were many kind of flags, all binary(bool), and all set by this case.
      break;
    case SET_TOKENSTATUS:
      return Object.assign({}, state, {
        ...action.status
      })
      break;
    case SET_UNITVIEW:
      return Object.assign({}, state, {
        unitView: action.unitView
      })
      break;
    case SET_UNITCURRENT:
      return Object.assign({}, state, {
        unitCurrent: action.unitCurrent
      })
      break;
    case SET_BELONGSBYTYPE:
      return Object.assign({}, state, {
        belongsByType: {...state.belongsByType, ...action.typeObj}
      })
      break;
    case SET_INDEXLISTS:
      return Object.assign({}, state, {
        indexLists: {...state.indexLists, ...action.lists}
      })
      break;
    case SUBMIT_FEEDASSIGN:
      return Object.assign({}, state, {
        indexLists: {...state.indexLists, ...action.listsObj}
      })
      break;
    case UPDATE_NOUNSBASIC:
      return Object.assign({}, state, {
        nounsBasic: {...state.nounsBasic, ...action.newFetch}
      })
      break;
    case UPDATE_USERSBASIC:
      return Object.assign({}, state, {
        usersBasic: {...state.usersBasic, ...action.newFetch}
      })
      break;
    case UNIT_SUBMITTING_SWITCH:
      return Object.assign({}, state, {
        unitSubmitting: action.unitSubmitting
      })
      break;
    default:
      return state
  }
}

export default pageWithin
