import React from "react"

import { NavBar } from 'antd-mobile'

import './index.scss'

class CityList extends React.Component {
    render() {
        return (
            <div className="city-list">
                <NavBar
                    mode="light"
                    icon={<i className="iconfont icon-back" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>
            </div>
        )
    }
}

export default CityList