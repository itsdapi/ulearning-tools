import './App.css';
import {Tools} from './tools'
import {Component} from 'react'
import {Button, Table, Space} from 'antd';


class App extends Component<any, any> {
    private Tool: Tools = new Tools()

    state = {
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
                render: (_, record) => (
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

    render() {
        return (
            <div className={'App'}>
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
