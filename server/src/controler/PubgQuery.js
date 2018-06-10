import https from "https"

export class PubgQuery {
    constructor() {
        this.private = new PubgQueryPrivate
    }

    GetUserProfile(nick_name) { 
        return new Promise( (resolve, reject) => {
            this.private.get_user_id(nick_name).then( (ret) => {
                let user_id = ret
                console.log("userid:", user_id)
                this.private.get_user_profile(user_id, "as").then( (ret) => {
                    console.log("user profile:", ret)
                    resolve(ret)
                }, (ret) => {
                    reject(ret)
                })
            }, (ret) => {
                reject(ret)
            })
        })
    }
}

class PubgQueryPrivate {
    constructor() {

    }

    get_user_profile(user_id, server) {
        return new Promise( (resolve, reject) => {
            let options = {
                hostname: 'pubg.op.gg',
                path: '/api/users/' + user_id + '/matches/recent?server=as',
                method: 'GET',
                headers: {
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36'
                }
            }
            
            console.log(JSON.stringify(options))
            this.send_request(options).then( (ret) => {
                resolve(ret)
            }, (ret) => {
                reject("not found by user id:", user_id)
            })
        })
    }

    get_user_id(nick_name) {
        return new Promise( (resolve, reject) => {
            let options = {
                hostname: 'pubg.op.gg',
                path: '/user/' + nick_name + '?server=as',
                method: 'GET',
                headers: {
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36'
                }
            }

            console.log(JSON.stringify(options))
            this.send_request(options).then( (ret) => {
                let user_id = this.parse_userid_html_content(ret)
                if (user_id === null) {
                    reject("user id not found by nickname:", nick_name)
                }

                resolve(user_id)
            }, (ret) => {
                console.log(ret)
                reject("not found by nick name:", nick_name)
            })
        });
    }

    send_request(options) {
        return new Promise( (resolve, reject) => {
            const req = https.request(options, (res) => {
                let content = "";
                console.log(`STATUS: ${res.statusCode}`);
    
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    content += chunk
                });
                res.on('end', () => {
                    resolve(content)
                });
            }).on('error', (e) => {
                res.reject(e.message)
                console.error(`problem with request: ${e.message}`);
            })

            req.end();
        })
    }

    parse_userid_html_content(content) {
        let reg = /data-u-user_id="(\w+)"/
        let ret = reg.exec(content)

        if (ret === null) {
            return null
        }

        return ret[1]
    }
}