import {render} from "react-dom";
import {Space} from "antd";

interface classList {
    "courseList": Array<classItem>
}

interface homeworkList {
    "homeworkList": Array<homeworkItem>
}

interface classItem {
    "id": number,
    "name": string,
    "status": number,
}

export interface homeworkItem {
    "id": number,
    "homeworkTitle": string,
    "startTime": Date,
    "endTime": string,
    "state": number,
    "score": number,
    "className": string,
    "url": string
    "state_CN": string,
}

const state = {
    0: '未提交',
    1: '未互评',
    5: '需重写'
    //0.未提交1.未互评2.互评中3.待批阅4.已批阅5.需重写6.申诉中7.申诉成功8.申诉失败9逾期未交
}

export class Tools {

    config = {
        bypass: /读书心得/gm
    }

    public async getUndoneHomework(limit:number): Promise<(homeworkList | homeworkItem)[]> {
        const token = this.getToken()
        const classList = await this.getAllClassList(token, limit)
        let undoneList:(homeworkList | homeworkItem)[] = []
        for (let classItem of classList) {
            //跳过不需要找的课程
            if(this.config.bypass.exec(classItem.name)){
                continue
            }
            const homeworkList = await this.getAllHomeworkList(token, classItem.id, classItem.name)
            if(typeof(homeworkList) === 'undefined') {
                continue
            }
            for (let homeworkItem of homeworkList) {
                if(homeworkItem.state === 0 || homeworkItem.state === 1 || homeworkItem.state === 5) {
                    homeworkItem.state_CN = state[`${homeworkItem.state}`]
                    homeworkItem.className = classItem.name
                    homeworkItem.endTime = new Date(homeworkItem.endTime).toLocaleString()
                    homeworkItem.url = `https://courseweb.ulearning.cn/ulearning/index.html#/course/homework?courseId=${classItem.id}`
                    undoneList = [...undoneList, homeworkItem]
                }
            }
        }

        return undoneList
    }

    private getToken(): string {
        const cookies = document.cookie;
        const token = /token.*?(;|$)/gm.exec(cookies)![0].substring(6).slice(0, -1);
        console.log("Get Token success", token);
        return token
    }

    private async getAllClassList(token: string, limit: number): Promise<Array<classItem>> {
        const classList = await this.send(`https://courseapi.ulearning.cn/courses/students?keyword=&publishStatus=1&type=1&pn=1&ps=${limit}&lang=zh`, token) as classList
        console.log('classList', classList)
        return classList.courseList
    }

    private async getAllHomeworkList(token:string, ocid:number, name: string): Promise<Array<homeworkItem>> {
        const homeworkList = await this.send(`https://courseapi.ulearning.cn/homeworks/student/v2?ocId=${ocid}&pn=1&ps=999&lang=zh`, token) as homeworkList
        console.log('Checking ', name)
        // console.log('homeworklist: ', homeworkList)
        return homeworkList.homeworkList
    }

    private send(url: string, token: string): object {
        const xhr = new XMLHttpRequest();
        return new Promise((res, rej) => {
            xhr.open("GET", url, true);
            xhr.setRequestHeader("AUTHORIZATION", token);
            xhr.onreadystatechange = () => {
                // In local files, status is 0 upon success in Mozilla Firefox
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    const status = xhr.status;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        res(JSON.parse(xhr.responseText));
                    } else {
                        rej(xhr.responseText);
                    }
                }
            };
            xhr.send();
        });
    }
}

