import React from "react"

import { List, AutoSizer } from 'react-virtualized';

import { NavBar } from 'antd-mobile'

import './index.scss'
import axios from "axios"

import { getCurrentCity } from "../../utils"

//数据格式化

const formatCityData = list => {
    const cityList = {};
    // 1.遍历list数组
    list.forEach(item => {
        // 2.获取每个城市的首字母
        const first = item.short.substr(0, 1);

        // 3.判断cityList是否有该分类
        if (cityList[first]) {
            // 如果有，就往里面添加数据
            cityList[first].push(item)
        } else {
            // 如果没有，就新增数据
            cityList[first] = [item]
        }

    });

    // 获取索引字母数据
    const cityIndex = Object.keys(cityList).sort()
    return {
        cityList, cityIndex
    }
}

//格式化城市选择标题
const formatCityIndex = str => {
    if (str === '#') {
        str = '当前定位'
    } else if (str === 'hot') {
        str = '热门城市'
    }
    return str.toUpperCase()
}


// 列表数据数据源
// const list = Array(1000).fill('react-virtualized');




class CityList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            cityList: {},
            cityIndex: [],

            // 添加右侧城市索引高亮index
            activeIndex: 0
        }

        // 创建List的ref对象,通过ref获取组件的实例
        this.cityListComponent = React.createRef();
    }

    async getCityList() {
        // 获取城市列表，并初始化城市列表数据
        const res = await axios.get('http://49.232.149.129:8080/area/city?level=1');
        const { cityList, cityIndex } = formatCityData(res.data.body);

        // 获取热门城市数据
        const hotCity = await axios.get('http://49.232.149.129:8080/area/hot');
        // 将热门城市添加进城市列表和城市索引中
        cityList['hot'] = hotCity.data.body;
        cityIndex.unshift('hot');

        //获取当前定位城市，并添加到城市列表和城市索引中
        const curCity = await getCurrentCity();
        cityList['#'] = [curCity];
        cityIndex.unshift('#')

        this.setState({
            cityList, cityIndex
        })
    }

    async componentDidMount() {
        await this.getCityList()

        // 调用measureAllRows,提前计算List组件中每一行的高度，实现scrollToRow的精确跳转
        // 注意：调用这个方法的时候，必须要保证List组件中已经有数据了。如果List组件中的数据为空，那么就会报错
        // 解决：只要保证该方法是在获取到数据之后调用的，就可以了
        this.cityListComponent.current.measureAllRows()
    }

    // 渲染每一行数据的函数
    // 函数的返回值就表示最终渲染在页面中的内容
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // 索引号
        isScrolling, // 当前项是否正在滚动中
        isVisible, // 当前项在list中是可见的
        style, // 重点属性，一定要给每一行添加这个属性，作用：指定每一行的位置
    }) => {
        const { cityIndex, cityList } = this.state;
        const letter = cityIndex[index];
        return (
            <div key={key} style={style} className="city">
                <div className="title">
                    {formatCityIndex(letter)}
                </div>

                {/* 当前索引对应的城市列表 */}
                {
                    cityList[letter].map(item => (
                        <div onClick={this.changeCity} key={item.value} className="name">{item.label}</div>
                    ))
                }
            </div>
        );
    }

    // 获取每一行的动态高度
    getRowHeight = ({ index }) => {
        // 索引标题高度 + 城市数量 * 城市名称高度
        const { cityIndex, cityList } = this.state;
        return cityList[cityIndex[index]].length * 50 + 36
    }

    changeCity = i => {
        console.log(i)
    }

    //获取List组件中渲染行的信息
    onRowsRendered = ({ startIndex }) => {
        if (startIndex !== this.state.activeIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }

    // 渲染城市索引数据
    renderCityIndex = () => {
        const { cityIndex, activeIndex } = this.state;
        return cityIndex.map((item, index) => (
            <li key={item} className="city-nav-item" onClick={() => {
                this.cityListComponent.current.scrollToRow(index)
            }}>
                <span className={activeIndex === index ? 'active' : ''}>
                    {item === 'hot' ? '热' : item.toUpperCase()}
                </span>
            </li>
        ))
    }

    render() {
        return (
            <div className="city-list">
                <NavBar
                    mode="light"
                    icon={<i className="iconfont icon-back" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>

                {/* 渲染城市列表 */}
                <AutoSizer>
                    {
                        ({ width, height }) => (
                            <List
                                ref={this.cityListComponent}
                                width={width}
                                height={height - 45}
                                rowCount={this.state.cityIndex.length}
                                rowHeight={this.getRowHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.onRowsRendered}
                                scrollToAlignment="start"
                            />
                        )
                    }
                </AutoSizer>

                <ul className="city-nav">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}

export default CityList