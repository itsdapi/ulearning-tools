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

enum state {
    '0' = '未提交',
    '2' = '互评中'
}

export class Tools {

    config = {
        bypass: /读书心得/gm
    }

    public async getUndoneHomework(limit:number): Promise<homeworkList> {
        const token = this.getToken()
        const classList = await this.getAllClassList(token, limit)
        let undoneList = []
        for (let classItem of classList) {
            //跳过不需要找的课程
            if(this.config.bypass.exec(classItem.name)){
                continue
            }
            const homeworkList = await this.getAllHomeworkList(token, classItem.id)
            if(typeof(homeworkList) === 'undefined') {
                continue
            }
            for (let homeworkItem of homeworkList) {
                if(homeworkItem.state === 0 || homeworkItem.state === 2) {
                    homeworkItem.state_CN = state[`${homeworkItem.state}`]
                    homeworkItem.className = classItem.name
                    homeworkItem.endTime = new Date(homeworkItem.endTime).toLocaleString()
                    homeworkItem.url = `https://courseweb.ulearning.cn/ulearning/index.html#/course/homework?courseId=${classItem.id}`
                    undoneList = [...undoneList, homeworkItem]
                }
            }
        }

        return undoneList as homeworkList
    }

    private getToken(): string {
        const cookies = document.cookie;
        const token = /token.*?(;|$)/gm.exec(cookies)![0].substring(6).slice(0, -1);
        console.log("Get Token success", token);
        return token
    }

    private async getAllClassList(token: string, limit: number): Promise<Array<classItem>> {
        const classList = await this.send(`https://courseapi.ulearning.cn/courses/students?keyword=&publishStatus=1&type=1&pn=1&ps=${limit}&lang=zh`, token) as classList
        return classList.courseList
    }

    private async getAllHomeworkList(token:string, ocid:number): Promise<Array<homeworkItem>> {
        const homeworkList = await this.send(`https://courseapi.ulearning.cn/homeworks/student/v2?ocId=${ocid}&pn=1&ps=999&lang=zh`, token) as homeworkList
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

