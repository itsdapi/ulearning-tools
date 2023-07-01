import './App.css';
import {Tools, homeworkItem} from './tools'
import {Component} from 'react'
import {Button, Table, Space} from 'antd';


class App extends Component<any, any> {
    private Tool: Tools = new Tools()
    private divElement: HTMLDivElement | null = null

    state = {
        isShow: false,
        box_height: 200,
        dataSource: [],
        isButtonLoading: false,
        columns: [
            {
                title: '课程',
                dataIndex: 'className',
            },
            {
                title: '作业',
                dataIndex: 'homeworkTitle',
            },
            {
                title: '结束时间',
                dataIndex: 'endTime',
            },
            {
                title: '状态',
                dataIndex: 'state_CN',
            },
            {
                title: '动作',
                render: (_:any, record:homeworkItem) => (
                    <Space size="middle">
                        <a href={record.url}>飞过去</a>
                    </Space>
                ),
            },
        ]
    }

    onCheckClick = async () => {
        this.setState({
            isButtonLoading: true
        })
        const data = await this.Tool.getUndoneHomework(99)
        this.setState({
            dataSource: data,
            isButtonLoading: false
        })
    }

    onShowHideClick = ():void => {
        this.getBoxHeight()
        let isShow = this.state.isShow
        this.setState({
            isShow: !isShow,
        })
    }

    getBoxHeight = ():void => {
        const height:number | undefined = this.divElement?.clientHeight
        console.log(`clientHeight = ${height}`)
        this.setState({
            box_height: height
        })
    }

    componentDidMount() {
        this.getBoxHeight()
    }

    render() {
        return (
            <div className={'App'} style={this.state.isShow ? {} : {transform: `translateY(${this.state.box_height-65}px)`}} ref={ (divElement) => { this.divElement = divElement } }>
                <a onClick={this.onShowHideClick} className={'showhide-button'}>{this.state.isShow ? '收起' : '展开'}</a>
                <Table columns={this.state.columns} dataSource={this.state.dataSource} rowKey={(record) => record.id}/>
                <div className={'config-wrapper'}>
                    <Space size={'middle'}>
                        <Button onClick={this.onCheckClick} type={"primary"}
                                loading={this.state.isButtonLoading}>查询作业</Button>
                    </Space>
                </div>
            </div>
        )
    }
}

export default App;
