import s from './Selector.module.scss'

export const Selector = ({ items, defaultValue }) => {

    return (
        <select className={s.select} required="" defaultValue={defaultValue}>
            { items.map(item => <option key={item.number} value={item.number}>{ item.priority }</option>) }
        </select>
    )
}