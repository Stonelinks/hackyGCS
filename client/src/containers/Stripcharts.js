import { Sparklines, SparklinesLine } from 'react-sparklines';
import { connect } from 'react-redux'

// const getVisibleTodos = (todos, filter) => {
//   switch (filter) {
//     case 'SHOW_ALL':
//       return todos
//     case 'SHOW_COMPLETED':
//       return todos.filter(t => t.completed)
//     case 'SHOW_ACTIVE':
//       return todos.filter(t => !t.completed)
//     default:
//       throw new Error('Unknown filter: ' + filter)
//   }
// }

// const mapStateToProps = (state) => ({
//   todos: getVisibleTodos(state.todos, state.visibilityFilter)
// })

import React, { PropTypes } from 'react'
import Todo from './Todo'

const STRIPCHART_LIMIT = 350

const Stripchart = ({ name, data }) => (
  <code>{name}: {data[data.length - 1]}</code>
  <Sparklines data={data} limit={STRIPCHART_LIMIT} width={1000} height={70} margin={5}>
    <SparklinesLine color="black" />
  </Sparklines>
)

Stripchart.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired).isRequired,
}

const Stripcharts = ({ attitudeTelemetry }) => (
  <ul>
    {Object.keys(attitudeTelemetry).map((key) => {
      <Stripchart
        key={key}
        name={key}
        data={attitudeTelemetry[key]}
      />
    )}}
  </ul>
)

Stripcharts.propTypes = {
  attitudeTelemetry: PropTypes.objectOf(PropTypes.number).isRequired).isRequired,
}

const mapStateToProps = (state) => ({
  attitudeTelemetry: state.attitudeTelemetry
})

export default connect(
  mapStateToProps,
  null
)(Stripcharts)
