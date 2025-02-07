import React, {Component} from 'react';
import {MDBCard, MDBCardBody, MDBCardHeader, MDBCardImage, MDBCardTitle, MDBIcon} from "mdbreact";
import {logout, removeLocalUserInfo} from "../Utility";
import axios from "axios";
import {Row, Col, Divider, Button, Cascader, Modal} from 'antd';
import {Link} from "react-router-dom";
import reactStringReplace from "react-string-replace";

class PersonPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loading2: true,
            uploading: false,
            successInfo: false,
            uploadingPass: false,
            username: '',
            country: '',
            city: '',
            newCity: '',
            email: '',
            IELTS1: 0,   //雅思模考券
            IELTS2: 0,   //雅思点评券
            PTE1: 0,     //PTE模考券
            PTE2: 0,     //PTE点评券
            CCL1: 0,     //CCL模考券
            CCL2: 0,     //CCL点评券
            isVIP: false,
            VIPStart: '',
            VIPEnd: '',
            discount:[]
        }
    }

    componentDidMount() {
        // const original = '[{"value":"北京市","children":[{"value":"东城区"},{"value":"西城区"},{"value":"朝阳区"},{"value":"丰台区"},{"value":"石景山区"},{"value":"海淀区"},{"value":"门头沟区"},{"value":"房山区"},{"value":"通州区"},{"value":"顺义区"},{"value":"昌平区"},{"value":"大兴区"},{"value":"怀柔区"},{"value":"平谷区"},{"value":"密云区"},{"value":"延庆区"}]},{"value":"天津市","children":[{"value":"和平区"},{"value":"河东区"},{"value":"河西区"},{"value":"南开区"},{"value":"河北区"},{"value":"红桥区"},{"value":"东丽区"},{"value":"西青区"},{"value":"津南区"},{"value":"北辰区"},{"value":"武清区"},{"value":"宝坻区"},{"value":"滨海新区"},{"value":"宁河区"},{"value":"静海区"},{"value":"蓟州区"}]},{"value":"河北省","children":[{"value":"石家庄市"},{"value":"唐山市"},{"value":"秦皇岛市"},{"value":"邯郸市"},{"value":"邢台市"},{"value":"保定市"},{"value":"张家口市"},{"value":"承德市"},{"value":"沧州市"},{"value":"廊坊市"},{"value":"衡水市"}]},{"value":"山西省","children":[{"value":"太原市"},{"value":"大同市"},{"value":"阳泉市"},{"value":"长治市"},{"value":"晋城市"},{"value":"朔州市"},{"value":"晋中市"},{"value":"运城市"},{"value":"忻州市"},{"value":"临汾市"},{"value":"吕梁市"}]},{"value":"内蒙古自治区","children":[{"value":"呼和浩特市"},{"value":"包头市"},{"value":"乌海市"},{"value":"赤峰市"},{"value":"通辽市"},{"value":"鄂尔多斯市"},{"value":"呼伦贝尔市"},{"value":"巴彦淖尔市"},{"value":"乌兰察布市"},{"value":"兴安盟"},{"value":"锡林郭勒盟"},{"value":"阿拉善盟"}]},{"value":"辽宁省","children":[{"value":"沈阳市"},{"value":"大连市"},{"value":"鞍山市"},{"value":"抚顺市"},{"value":"本溪市"},{"value":"丹东市"},{"value":"锦州市"},{"value":"营口市"},{"value":"阜新市"},{"value":"辽阳市"},{"value":"盘锦市"},{"value":"铁岭市"},{"value":"朝阳市"},{"value":"葫芦岛市"}]},{"value":"吉林省","children":[{"value":"长春市"},{"value":"吉林市"},{"value":"四平市"},{"value":"辽源市"},{"value":"通化市"},{"value":"白山市"},{"value":"松原市"},{"value":"白城市"},{"value":"延边朝鲜族自治州"}]},{"value":"黑龙江省","children":[{"value":"哈尔滨市"},{"value":"齐齐哈尔市"},{"value":"鸡西市"},{"value":"鹤岗市"},{"value":"双鸭山市"},{"value":"大庆市"},{"value":"伊春市"},{"value":"佳木斯市"},{"value":"七台河市"},{"value":"牡丹江市"},{"value":"黑河市"},{"value":"绥化市"},{"value":"大兴安岭地区"}]},{"value":"上海市","children":[{"value":"黄浦区"},{"value":"徐汇区"},{"value":"长宁区"},{"value":"静安区"},{"value":"普陀区"},{"value":"虹口区"},{"value":"杨浦区"},{"value":"闵行区"},{"value":"宝山区"},{"value":"嘉定区"},{"value":"浦东新区"},{"value":"金山区"},{"value":"松江区"},{"value":"青浦区"},{"value":"奉贤区"},{"value":"崇明区"}]},{"value":"江苏省","children":[{"value":"南京市"},{"value":"无锡市"},{"value":"徐州市"},{"value":"常州市"},{"value":"苏州市"},{"value":"南通市"},{"value":"连云港市"},{"value":"淮安市"},{"value":"盐城市"},{"value":"扬州市"},{"value":"镇江市"},{"value":"泰州市"},{"value":"宿迁市"}]},{"value":"浙江省","children":[{"value":"杭州市"},{"value":"宁波市"},{"value":"温州市"},{"value":"嘉兴市"},{"value":"湖州市"},{"value":"绍兴市"},{"value":"金华市"},{"value":"衢州市"},{"value":"舟山市"},{"value":"台州市"},{"value":"丽水市"}]},{"value":"安徽省","children":[{"value":"合肥市"},{"value":"芜湖市"},{"value":"蚌埠市"},{"value":"淮南市"},{"value":"马鞍山市"},{"value":"淮北市"},{"value":"铜陵市"},{"value":"安庆市"},{"value":"黄山市"},{"value":"滁州市"},{"value":"阜阳市"},{"value":"宿州市"},{"value":"六安市"},{"value":"亳州市"},{"value":"池州市"},{"value":"宣城市"}]},{"value":"福建省","children":[{"value":"福州市"},{"value":"厦门市"},{"value":"莆田市"},{"value":"三明市"},{"value":"泉州市"},{"value":"漳州市"},{"value":"南平市"},{"value":"龙岩市"},{"value":"宁德市"}]},{"value":"江西省","children":[{"value":"南昌市"},{"value":"景德镇市"},{"value":"萍乡市"},{"value":"九江市"},{"value":"新余市"},{"value":"鹰潭市"},{"value":"赣州市"},{"value":"吉安市"},{"value":"宜春市"},{"value":"抚州市"},{"value":"上饶市"}]},{"value":"山东省","children":[{"value":"济南市"},{"value":"青岛市"},{"value":"淄博市"},{"value":"枣庄市"},{"value":"东营市"},{"value":"烟台市"},{"value":"潍坊市"},{"value":"济宁市"},{"value":"泰安市"},{"value":"威海市"},{"value":"日照市"},{"value":"临沂市"},{"value":"德州市"},{"value":"聊城市"},{"value":"滨州市"},{"value":"菏泽市"}]},{"value":"河南省","children":[{"value":"郑州市"},{"value":"开封市"},{"value":"洛阳市"},{"value":"平顶山市"},{"value":"安阳市"},{"value":"鹤壁市"},{"value":"新乡市"},{"value":"焦作市"},{"value":"濮阳市"},{"value":"许昌市"},{"value":"漯河市"},{"value":"三门峡市"},{"value":"南阳市"},{"value":"商丘市"},{"value":"信阳市"},{"value":"周口市"},{"value":"驻马店市"}]},{"value":"湖北省","children":[{"value":"武汉市"},{"value":"黄石市"},{"value":"十堰市"},{"value":"宜昌市"},{"value":"襄阳市"},{"value":"鄂州市"},{"value":"荆门市"},{"value":"孝感市"},{"value":"荆州市"},{"value":"黄冈市"},{"value":"咸宁市"},{"value":"随州市"},{"value":"恩施土家族苗族自治州"}]},{"value":"湖南省","children":[{"value":"长沙市"},{"value":"株洲市"},{"value":"湘潭市"},{"value":"衡阳市"},{"value":"邵阳市"},{"value":"岳阳市"},{"value":"常德市"},{"value":"张家界市"},{"value":"益阳市"},{"value":"郴州市"},{"value":"永州市"},{"value":"怀化市"},{"value":"娄底市"},{"value":"湘西土家族苗族自治州"}]},{"value":"广东省","children":[{"value":"广州市"},{"value":"韶关市"},{"value":"深圳市"},{"value":"珠海市"},{"value":"汕头市"},{"value":"佛山市"},{"value":"江门市"},{"value":"湛江市"},{"value":"茂名市"},{"value":"肇庆市"},{"value":"惠州市"},{"value":"梅州市"},{"value":"汕尾市"},{"value":"河源市"},{"value":"阳江市"},{"value":"清远市"},{"value":"东莞市"},{"value":"中山市"},{"value":"潮州市"},{"value":"揭阳市"},{"value":"云浮市"}]},{"value":"广西壮族自治区","children":[{"value":"南宁市"},{"value":"柳州市"},{"value":"桂林市"},{"value":"梧州市"},{"value":"北海市"},{"value":"防城港市"},{"value":"钦州市"},{"value":"贵港市"},{"value":"玉林市"},{"value":"百色市"},{"value":"贺州市"},{"value":"河池市"},{"value":"来宾市"},{"value":"崇左市"}]},{"value":"海南省","children":[{"value":"海口市"},{"value":"三亚市"},{"value":"三沙市"},{"value":"儋州市"}]},{"value":"重庆市","children":[{"value":"万州区"},{"value":"涪陵区"},{"value":"渝中区"},{"value":"大渡口区"},{"value":"江北区"},{"value":"沙坪坝区"},{"value":"九龙坡区"},{"value":"南岸区"},{"value":"北碚区"},{"value":"綦江区"},{"value":"大足区"},{"value":"渝北区"},{"value":"巴南区"},{"value":"黔江区"},{"value":"长寿区"},{"value":"江津区"},{"value":"合川区"},{"value":"永川区"},{"value":"南川区"},{"value":"璧山区"},{"value":"铜梁区"},{"value":"潼南区"},{"value":"荣昌区"},{"value":"开州区"},{"value":"梁平区"},{"value":"武隆区"},{"value":"城口县"},{"value":"丰都县"},{"value":"垫江县"},{"value":"忠县"},{"value":"云阳县"},{"value":"奉节县"},{"value":"巫山县"},{"value":"巫溪县"},{"value":"石柱土家族自治县"},{"value":"秀山土家族苗族自治县"},{"value":"酉阳土家族苗族自治县"},{"value":"彭水苗族土家族自治县"}]},{"value":"四川省","children":[{"value":"成都市"},{"value":"自贡市"},{"value":"攀枝花市"},{"value":"泸州市"},{"value":"德阳市"},{"value":"绵阳市"},{"value":"广元市"},{"value":"遂宁市"},{"value":"内江市"},{"value":"乐山市"},{"value":"南充市"},{"value":"眉山市"},{"value":"宜宾市"},{"value":"广安市"},{"value":"达州市"},{"value":"雅安市"},{"value":"巴中市"},{"value":"资阳市"},{"value":"阿坝藏族羌族自治州"},{"value":"甘孜藏族自治州"},{"value":"凉山彝族自治州"}]},{"value":"贵州省","children":[{"value":"贵阳市"},{"value":"六盘水市"},{"value":"遵义市"},{"value":"安顺市"},{"value":"毕节市"},{"value":"铜仁市"},{"value":"黔西南布依族苗族自治州"},{"value":"黔东南苗族侗族自治州"},{"value":"黔南布依族苗族自治州"}]},{"value":"云南省","children":[{"value":"昆明市"},{"value":"曲靖市"},{"value":"玉溪市"},{"value":"保山市"},{"value":"昭通市"},{"value":"丽江市"},{"value":"普洱市"},{"value":"临沧市"},{"value":"楚雄彝族自治州"},{"value":"红河哈尼族彝族自治州"},{"value":"文山壮族苗族自治州"},{"value":"西双版纳傣族自治州"},{"value":"大理白族自治州"},{"value":"德宏傣族景颇族自治州"},{"value":"怒江傈僳族自治州"},{"value":"迪庆藏族自治州"}]},{"value":"西藏自治区","children":[{"value":"拉萨市"},{"value":"日喀则市"},{"value":"昌都市"},{"value":"林芝市"},{"value":"山南市"},{"value":"那曲市"},{"value":"阿里地区"}]},{"value":"陕西省","children":[{"value":"西安市"},{"value":"铜川市"},{"value":"宝鸡市"},{"value":"咸阳市"},{"value":"渭南市"},{"value":"延安市"},{"value":"汉中市"},{"value":"榆林市"},{"value":"安康市"},{"value":"商洛市"}]},{"value":"甘肃省","children":[{"value":"兰州市"},{"value":"嘉峪关市"},{"value":"金昌市"},{"value":"白银市"},{"value":"天水市"},{"value":"武威市"},{"value":"张掖市"},{"value":"平凉市"},{"value":"酒泉市"},{"value":"庆阳市"},{"value":"定西市"},{"value":"陇南市"},{"value":"临夏回族自治州"},{"value":"甘南藏族自治州"}]},{"value":"青海省","children":[{"value":"西宁市"},{"value":"海东市"},{"value":"海北藏族自治州"},{"value":"黄南藏族自治州"},{"value":"海南藏族自治州"},{"value":"果洛藏族自治州"},{"value":"玉树藏族自治州"},{"value":"海西蒙古族藏族自治州"}]},{"value":"宁夏回族自治区","children":[{"value":"银川市"},{"value":"石嘴山市"},{"value":"吴忠市"},{"value":"固原市"},{"value":"中卫市"}]},{"value":"新疆维吾尔自治区","children":[{"value":"乌鲁木齐市"},{"value":"克拉玛依市"},{"value":"吐鲁番市"},{"value":"哈密市"},{"value":"昌吉回族自治州"},{"value":"博尔塔拉蒙古自治州"},{"value":"巴音郭楞蒙古自治州"},{"value":"阿克苏地区"},{"value":"克孜勒苏柯尔克孜自治州"},{"value":"喀什地区"},{"value":"和田地区"},{"value":"伊犁哈萨克自治州"},{"value":"塔城地区"},{"value":"阿勒泰地区"}]},{"value":"台湾省","children":[]},{"value":"香港特别行政区","children":[]},{"value":"澳门特别行政区","children":[]}]'
        // const level1 = '[{"value":"北京市"},{"value":"天津市"},{"value":"河北省"},{"value":"山西省"},{"value":"内蒙古自治区"},{"value":"辽宁省"},{"value":"吉林省"},{"value":"黑龙江省"},{"value":"上海市"},{"value":"江苏省"},{"value":"浙江省"},{"value":"安徽省"},{"value":"福建省"},{"value":"江西省"},{"value":"山东省"},{"value":"河南省"},{"value":"湖北省"},{"value":"湖南省"},{"value":"广东省"},{"value":"广西壮族自治区"},{"value":"海南省"},{"value":"重庆市"},{"value":"四川省"},{"value":"贵州省"},{"value":"云南省"},{"value":"西藏自治区"},{"value":"陕西省"},{"value":"甘肃省"},{"value":"青海省"},{"value":"宁夏回族自治区"},{"value":"新疆维吾尔自治区"},{"value":"台湾省"},{"value":"香港特别行政区"},{"value":"澳门特别行政区"},{"value":"海外"}]';
        //
        // let cities = reactStringReplace(level1, /"value":"(.+?)"/g, (match, i) => (
        //     `"value":"${match}","label":"${match}"`
        // ));
        // let result='';
        // for (let i = 0; i < cities.length; i++) {
        //     result += cities[i];
        // }
        // localStorage.setItem('cities',JSON.stringify(result));

        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        //若没有登录信息或失效，则去引导页
        if (token === null || userID === null) {
            logout();
            return;
        }

        axios.get(global.config.url + `User/UserInfo?userID=` + userID, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            //console.log(res);
            //console.log(res.headers);
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                let json = res.data.data;
                this.setState({
                    username: json['username'],
                    email: json['Email'],
                    country: json['Country'],
                    city: json['City'],
                    newCity: json['City'],
                    IELTS1: json['ielts_Voucher'],   //雅思模考券
                    IELTS2: json['expert_ielts_Voucher'],   //雅思点评券
                    PTE1: json['pte_Voucher'],     //PTE模考券
                    PTE2: json['expert_pte_Voucher'],     //PTE点评券
                    CCL1: json['ccl_Voucher'],     //CCL模考券
                    CCL2: json['expert_ccl_Voucher'],     //CCL点评券
                    isVIP: json['isVIP'] === 1,
                    VIPStart: json['VIPStart'],
                    VIPEnd: json['VIPEnd'],
                    VIPDay:Math.ceil((Date.parse(json['VIPEnd'])-Date.parse(json['VIPStart']))/86400000)
                })
            }
            this.setState({loading: false}, () => {
                // document.getElementById('country').value = this.state.country;
                // document.getElementById('city').value = [this.state.city];
            });
            //this.setState({loading: false, paperData: paperData, paperDataOriginal: paperData});
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            //Token过期
            if (typeof err.response !== 'undefined' && err.response.status === 401) {
                console.log('token过期或失效');
                logout();
            }
        })

        // axios.get(global.config.url + `User/GetPromotionInfo?userID=` + userID, {
        //     headers: {Authorization: `Bearer ${token}`}
        // }).then(res => {
        //     //console.log(res);
        //     //console.log(res.headers);
        //     //更新Token
        //     if (typeof res.headers.authorization !== 'undefined') {
        //         console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
        //         localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
        //     }
        //     if (res.data.msg === 'succeed') {
        //         let json = res.data.data;
        //         console.log(json);
        //         let discount = [];
        //         for(let discountType in json){
        //             for(let i=0;i<json[discountType].length;i++){
        //                 let voucher = json[discountType][i];
        //                 discount.push([discountType,voucher.value,voucher.CreateAt.split(' ')[0],Math.ceil(((Date.parse(voucher.CreateAt)+voucher.duration*24*60*60*1000)-Date.now())/86400000)]);
        //             }
        //         }
        //         console.log(discount);
        //         this.setState({discount:discount,loading2: false})
        //     }
        // }).catch(err => {
        //     console.log(err);
        //     console.log(err.response);
        //     //Token过期
        //     if (typeof err.response !== 'undefined' && err.response.status === 401) {
        //         console.log('token过期或失效');
        //         logout();
        //     }
        // })
    }

    setInfo = (e) => {
        e.preventDefault();

        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        //若没有登录信息或失效，则去引导页
        if (token === null || userID === null) {
            logout();
            return;
        }

        //let country = document.getElementById('country').value;
        //let city = document.getElementById('city').value;
        //if (this.state.country !== country || this.state.city !== city) {
        let formData = new FormData();
        formData.append('userID', userID);
        formData.append('Country', this.state.country);
        formData.append('City', this.state.newCity);

        if (this.state.city !== this.state.newCity) {
            this.setState({uploading: true, successInfo: false});
            console.log(this.state.city + '-' + this.state.newCity);
            axios({
                method: 'post',
                url: global.config.url + `User/SetCountryCity`,
                data: formData,
                headers: {Authorization: `Bearer ${token}`}
            }).then(res => {
                console.log(res);
                //console.log(res.headers);
                //更新Token
                if (typeof res.headers.authorization !== 'undefined') {
                    console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                    localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
                }
                if (res.data.msg === 'succeed') {
                    this.setState({uploading: false, successInfo: true});
                }
            }).catch(err => {
                console.log(err);
                if (typeof err.response !== 'undefined' && err.response.status === 401) {
                    console.log('token过期或失效');
                    logout();
                }
            })
        }
    }

    validatePass = (e) => {
        e.preventDefault();

        let oldPass = document.getElementById('oldPass').value;
        let newPass = document.getElementById('newPass').value;
        let newPass2 = document.getElementById('newPass2').value;
        let pass1 = false;
        let pass2 = false;
        let pass3 = false;

        if (!/[\S]{6,16}/.test(oldPass)) {
            document.getElementById('oldPass').classList.remove('is-valid');
            document.getElementById('oldPass').classList.add('is-invalid');
        } else {
            document.getElementById('oldPass').classList.remove('is-invalid');
            document.getElementById('oldPass').classList.add('is-valid');
            pass1 = true;
        }

        if (!/[\S]{6,16}/.test(newPass)) {
            document.getElementById('newPass').classList.remove('is-valid');
            document.getElementById('newPass').classList.add('is-invalid');
        } else {
            document.getElementById('newPass').classList.remove('is-invalid');
            document.getElementById('newPass').classList.add('is-valid');
            pass2 = true;
        }

        if ((!/[\S]{6,16}/.test(newPass2)) || newPass !== newPass2) {
            document.getElementById('newPass2').classList.remove('is-valid');
            document.getElementById('newPass2').classList.add('is-invalid');
        } else {
            document.getElementById('newPass2').classList.remove('is-invalid');
            document.getElementById('newPass2').classList.add('is-valid');
            pass3 = true;
        }

        if (pass1 && pass2 && pass3) {
            this.setInfoPass();
        }
    }

    setInfoPass = () => {

        let token = localStorage.getItem('access_token');
        let userID = localStorage.getItem('userID');

        //若没有登录信息或失效，则去引导页
        if (token === null || userID === null) {
            logout();
            return;
        }

        let oldPass = document.getElementById('oldPass').value;
        let newPass = document.getElementById('newPass').value;

        //let country = document.getElementById('country').value;
        //let city = document.getElementById('city').value;
        //if (this.state.country !== country || this.state.city !== city) {
        let formData = new FormData();
        formData.append('userID', userID);
        formData.append('oldpassword', oldPass);
        formData.append('newpassword', newPass);

        this.setState({uploadingPass: true});
        axios({
            method: 'post',
            url: global.config.url + `Main/OldPasswordReset`,
            data: formData,
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => {
            console.log(res);
            //console.log(res.headers);
            //更新Token
            if (typeof res.headers.authorization !== 'undefined') {
                console.log('get new token: ' + res.headers.authorization.split(' ')[1]);
                localStorage.setItem('access_token', res.headers.authorization.split(' ')[1]);
            }
            if (res.data.msg === 'succeed') {
                this.setState({uploadingPass: false});
                let {confirm} = Modal;
                confirm({
                    title: '密码重置成功，请重新登录',
                    cancelButtonProps: {style: {display: 'none'}},
                    okText: '确定',
                    centered: true,
                    onOk: () => {
                        removeLocalUserInfo();
                        window.location.href = '/';
                    }
                })
            }
        }).catch(err => {
            console.log(err.response);
            this.setState({uploadingPass: false});
            if (err.response.data.msg === 'password incorrect') {
                console.log('老密码错误');
                document.getElementById('oldPass').classList.remove('is-valid');
                document.getElementById('oldPass').classList.add('is-invalid');
                document.getElementById('newPass').classList.remove('is-valid');
                document.getElementById('newPass2').classList.remove('is-valid');
            }
        })

    }

    render() {
        return (
            this.state.loading
                ?
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                :
                <React.Fragment>
                    <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                        <MDBCardHeader style={cardHeader}>
                            个人信息
                        </MDBCardHeader>
                        <MDBCardBody style={cardBody}>
                            <form
                                className="needs-validation"
                                onSubmit={this.setInfo}
                                noValidate
                            >
                                <Row>
                                    <Col style={{width: '300px'}}>
                                        <div>用户名</div>
                                    </Col>
                                    <Col>
                                        <div>{this.state.username}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{width: '300px'}}>
                                        <div>邮箱</div>
                                    </Col>
                                    <Col>
                                        <div>{this.state.email}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{width: '300px'}}>
                                        <div>国家</div>
                                    </Col>
                                    <Col>
                                        <div>{this.state.country}</div>
                                        {/*<div>*/}
                                        {/*    <input id='country' autoComplete='off' className='form-control'*/}
                                        {/*           style={{width: '200px', height: '32px', display: 'inline'}}/>*/}
                                        {/*    <div className="invalid-feedback">*/}
                                        {/*        请提供正确国家*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{width: '300px'}}>
                                        <div>城市</div>
                                    </Col>
                                    {/*<Col>*/}
                                    {/*    <div>*/}
                                    {/*        <input id='city' autoComplete='off' className='form-control'*/}
                                    {/*               style={{width: '200px', height: '32px', display: 'inline'}}/>*/}
                                    {/*        <div className="invalid-feedback">*/}
                                    {/*            请提供正确城市*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</Col>*/}
                                    <Col>
                                        <Cascader id='city' options={level1} onChange={(value) => {
                                            this.setState({newCity: value})
                                        }} defaultValue={[this.state.city]}/>
                                    </Col>
                                </Row>
                                <Button htmlType='submit' style={{float: 'right'}}>保存</Button>
                            </form>
                            {
                                this.state.uploading
                                    ?
                                    <div className="spinner-border mr-3" role="status"
                                         style={{height: '30px', width: '30px', float: 'right'}}>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    : ''
                            }
                            {
                                this.state.successInfo
                                    ?
                                    <div className="mr-3" style={{float: 'right', color: 'green'}}>
                                        <MDBIcon icon="check" className="mr-2"/>保存成功
                                    </div>
                                    : ''
                            }
                        </MDBCardBody>
                    </MDBCard>
                    <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                        <MDBCardHeader style={cardHeader}>
                            修改密码
                        </MDBCardHeader>
                        <MDBCardBody style={cardBody}>
                            <form
                                className="needs-validation"
                                onSubmit={this.validatePass}
                                noValidate
                            >
                                <Row>
                                    <Col style={{width: '300px'}}>
                                        <div>请输入旧密码</div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <input id='oldPass' type="password" autoComplete='off'
                                                   className='form-control'
                                                   style={{width: '200px', height: '32px', display: 'inline'}}
                                                   onInput={(e)=>{e.target.classList.remove('is-invalid');}}
                                                   required/>
                                            <div className="invalid-feedback">
                                                旧密码错误
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{width: '300px'}}>
                                        <div>请输入新密码</div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <input id='newPass' type="password" autoComplete='off'
                                                   className='form-control'
                                                   style={{width: '200px', height: '32px', display: 'inline'}}
                                                   onInput={(e)=>{e.target.classList.remove('is-invalid');}}
                                                   required/>
                                            <div className="invalid-feedback">
                                                新密码错误，密码由6到16位非空格字符组成
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{width: '300px'}}>
                                        <div>再次确认新密码</div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <input id='newPass2' type="password" autoComplete='off'
                                                   className='form-control'
                                                   style={{width: '200px', height: '32px', display: 'inline'}}
                                                   onInput={(e)=>{e.target.classList.remove('is-invalid');}}
                                                   required/>
                                            <div className="invalid-feedback">
                                                新密码不一致
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Button htmlType='submit' style={{float: 'right'}}>更改</Button>
                            </form>
                            {
                                this.state.uploadingPass
                                    ?
                                    <div className="spinner-border mr-3" role="status"
                                         style={{height: '30px', width: '30px', float: 'right'}}>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    : ''
                            }
                        </MDBCardBody>
                    </MDBCard>
                    {/*<MDBCard style={{borderRadius: '20px', marginTop: '30px'}}>*/}
                    {/*    <MDBCardHeader style={cardHeader}>*/}
                    {/*        模考券信息*/}
                    {/*    </MDBCardHeader>*/}
                    {/*    <MDBCardBody style={cardBody}>*/}
                    {/*        <Row>*/}
                    {/*            <Col style={{width: '300px'}}>*/}
                    {/*                <div>雅思模考券</div>*/}
                    {/*                <div>雅思点评券</div>*/}
                    {/*                <Divider/>*/}
                    {/*                <div>PTE模考券</div>*/}
                    {/*                <div>PTE点评券</div>*/}
                    {/*                <Divider/>*/}
                    {/*                <div>CCL模考券</div>*/}
                    {/*                <div>CCL点评券</div>*/}
                    {/*            </Col>*/}
                    {/*            <Col>*/}
                    {/*                <div>{this.state.IELTS1}</div>*/}
                    {/*                <div>{this.state.IELTS2}</div>*/}
                    {/*                <Divider/>*/}
                    {/*                <div>{this.state.PTE1}</div>*/}
                    {/*                <div>{this.state.PTE2}</div>*/}
                    {/*                <Divider/>*/}
                    {/*                <div>{this.state.CCL1}</div>*/}
                    {/*                <div>{this.state.CCL2}</div>*/}
                    {/*            </Col>*/}
                    {/*        </Row>*/}
                    {/*        <Link to='VIP'><Button style={{float: 'right'}}>购买券</Button></Link>*/}
                    {/*    </MDBCardBody>*/}
                    {/*</MDBCard>*/}
                    {/*<MDBCard style={{borderRadius: '20px', marginTop: '30px'}}>*/}
                    {/*    <MDBCardHeader style={cardHeader}>*/}
                    {/*        优惠券信息*/}
                    {/*    </MDBCardHeader>*/}
                    {/*    <MDBCardBody style={cardBody}>*/}
                    {/*        {*/}
                    {/*            this.state.loading2*/}
                    {/*                ?*/}
                    {/*                <div className="d-flex justify-content-center align-items-center mt-5">*/}
                    {/*                    <div className="spinner-border" role="status">*/}
                    {/*                        <span className="sr-only">Loading...</span>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*                :*/}
                    {/*                <Row>*/}
                    {/*                    {*/}
                    {/*                        this.state.discount.map((voucher,i)=>{*/}
                    {/*                            return (*/}
                    {/*                                <MDBCard key={i} style={{width:'380px'}} className='m-3'>*/}
                    {/*                                    <Row>*/}
                    {/*                                        <Col style={{width:'150px',backgroundColor: '#E0E0E0'}} className='d-flex justify-content-center align-items-center'>*/}
                    {/*                                            <MDBIcon size='4x' icon="percent"/>*/}
                    {/*                                        </Col>*/}
                    {/*                                        <Col style={{width:'230px'}} className='p-4'>*/}
                    {/*                                            <div>类型：{voucher[0]}</div>*/}
                    {/*                                            <div>价值：{voucher[1]}元</div>*/}
                    {/*                                            <div>获取时间：{voucher[2]}</div>*/}
                    {/*                                            <div>剩余天数：{voucher[3]}</div>*/}
                    {/*                                            <Link to='VIP'><Button className='mt-2'>去使用</Button></Link>*/}
                    {/*                                        </Col>*/}
                    {/*                                    </Row>*/}
                    {/*                                </MDBCard>*/}
                    {/*                            )*/}
                    {/*                        })*/}
                    {/*                    }*/}
                    {/*                </Row>*/}
                    {/*        }*/}
                    {/*    </MDBCardBody>*/}
                    {/*</MDBCard>*/}
                    <MDBCard className='mt-5' style={{borderRadius: '20px'}}>
                        <MDBCardHeader style={cardHeader}>
                            VIP信息
                        </MDBCardHeader>
                        <MDBCardBody style={cardBody}>
                            <Row>
                                <Col style={{width: '300px'}}>
                                    <div>VIP</div>
                                    {
                                        this.state.isVIP
                                            ?
                                            <React.Fragment>
                                                <div>VIP开始时间</div>
                                                <div>VIP结束时间</div>
                                                <div>剩余天数</div>
                                            </React.Fragment>
                                            :
                                            ''
                                    }
                                </Col>
                                <Col>
                                    <div>{this.state.isVIP ?
                                        <React.Fragment>{vipIcon}您是VIP</React.Fragment> : '您还不是VIP会员'}</div>
                                    {
                                        this.state.isVIP
                                            ?
                                            <React.Fragment>
                                                <div>{this.state.VIPStart}</div>
                                                <div>{this.state.VIPEnd}</div>
                                                <div>{this.state.VIPDay}</div>
                                            </React.Fragment>
                                            :
                                            ''
                                    }
                                </Col>
                            </Row>
                            <Link to='VIP'><Button style={{float: 'right'}}>续费</Button></Link>
                        </MDBCardBody>
                    </MDBCard>
                </React.Fragment>
        );
    }
}

const cardHeader = {
    backgroundColor: global.config.brown,
    color: 'white',
    fontSize: '14pt',
    borderRadius: '20px 20px 0 0'
}

const cardBody = {
    fontSize: '12pt',
    lineHeight: '35px'
}

const vipIcon =
    <svg t="1598427452535" className="icon" viewBox="0 0 1024 1024" version="1.1"
         xmlns="http://www.w3.org/2000/svg" p-id="2418" width="35" height="35">
        <path
            d="M510.955102 831.738776c-23.510204 0-45.453061-9.926531-61.64898-27.167347L138.971429 468.114286c-28.734694-31.346939-29.779592-79.412245-1.567347-111.804082l117.55102-135.314286c15.673469-18.285714 38.661224-28.734694 63.216327-28.734694H705.306122c24.032653 0 47.020408 10.44898 62.693878 28.734694l118.073469 135.314286c28.212245 32.391837 27.689796 80.457143-1.567347 111.804082L572.081633 804.571429c-15.673469 17.240816-38.138776 27.167347-61.126531 27.167347z"
            fill="#F2CB51" p-id="2419"/>
        <path
            d="M506.77551 642.612245c-5.22449 0-10.971429-2.089796-15.15102-6.269388l-203.755102-208.979592c-7.836735-8.359184-7.836735-21.420408 0.522449-29.779592 8.359184-7.836735 21.420408-7.836735 29.779592 0.522449l189.12653 193.828572 199.053061-194.351021c8.359184-7.836735 21.420408-7.836735 29.779592 0.522449 7.836735 8.359184 7.836735 21.420408-0.522449 29.779592l-214.204081 208.979592c-4.179592 3.657143-9.404082 5.746939-14.628572 5.746939z"
            fill="#FFF7E1" p-id="2420"/>
    </svg>;

let cities = [{
    "value": "北京市",
    "label": "北京市",
    "children": [{"value": "东城区", "label": "东城区"}, {"value": "西城区", "label": "西城区"}, {
        "value": "朝阳区",
        "label": "朝阳区"
    }, {"value": "丰台区", "label": "丰台区"}, {"value": "石景山区", "label": "石景山区"}, {
        "value": "海淀区",
        "label": "海淀区"
    }, {"value": "门头沟区", "label": "门头沟区"}, {"value": "房山区", "label": "房山区"}, {
        "value": "通州区",
        "label": "通州区"
    }, {"value": "顺义区", "label": "顺义区"}, {"value": "昌平区", "label": "昌平区"}, {
        "value": "大兴区",
        "label": "大兴区"
    }, {"value": "怀柔区", "label": "怀柔区"}, {"value": "平谷区", "label": "平谷区"}, {
        "value": "密云区",
        "label": "密云区"
    }, {"value": "延庆区", "label": "延庆区"}]
}, {
    "value": "天津市",
    "label": "天津市",
    "children": [{"value": "和平区", "label": "和平区"}, {"value": "河东区", "label": "河东区"}, {
        "value": "河西区",
        "label": "河西区"
    }, {"value": "南开区", "label": "南开区"}, {"value": "河北区", "label": "河北区"}, {
        "value": "红桥区",
        "label": "红桥区"
    }, {"value": "东丽区", "label": "东丽区"}, {"value": "西青区", "label": "西青区"}, {
        "value": "津南区",
        "label": "津南区"
    }, {"value": "北辰区", "label": "北辰区"}, {"value": "武清区", "label": "武清区"}, {
        "value": "宝坻区",
        "label": "宝坻区"
    }, {"value": "滨海新区", "label": "滨海新区"}, {"value": "宁河区", "label": "宁河区"}, {
        "value": "静海区",
        "label": "静海区"
    }, {"value": "蓟州区", "label": "蓟州区"}]
}, {
    "value": "河北省",
    "label": "河北省",
    "children": [{"value": "石家庄市", "label": "石家庄市"}, {"value": "唐山市", "label": "唐山市"}, {
        "value": "秦皇岛市",
        "label": "秦皇岛市"
    }, {"value": "邯郸市", "label": "邯郸市"}, {"value": "邢台市", "label": "邢台市"}, {
        "value": "保定市",
        "label": "保定市"
    }, {"value": "张家口市", "label": "张家口市"}, {"value": "承德市", "label": "承德市"}, {
        "value": "沧州市",
        "label": "沧州市"
    }, {"value": "廊坊市", "label": "廊坊市"}, {"value": "衡水市", "label": "衡水市"}]
}, {
    "value": "山西省",
    "label": "山西省",
    "children": [{"value": "太原市", "label": "太原市"}, {"value": "大同市", "label": "大同市"}, {
        "value": "阳泉市",
        "label": "阳泉市"
    }, {"value": "长治市", "label": "长治市"}, {"value": "晋城市", "label": "晋城市"}, {
        "value": "朔州市",
        "label": "朔州市"
    }, {"value": "晋中市", "label": "晋中市"}, {"value": "运城市", "label": "运城市"}, {
        "value": "忻州市",
        "label": "忻州市"
    }, {"value": "临汾市", "label": "临汾市"}, {"value": "吕梁市", "label": "吕梁市"}]
}, {
    "value": "内蒙古自治区",
    "label": "内蒙古自治区",
    "children": [{"value": "呼和浩特市", "label": "呼和浩特市"}, {"value": "包头市", "label": "包头市"}, {
        "value": "乌海市",
        "label": "乌海市"
    }, {"value": "赤峰市", "label": "赤峰市"}, {"value": "通辽市", "label": "通辽市"}, {
        "value": "鄂尔多斯市",
        "label": "鄂尔多斯市"
    }, {"value": "呼伦贝尔市", "label": "呼伦贝尔市"}, {"value": "巴彦淖尔市", "label": "巴彦淖尔市"}, {
        "value": "乌兰察布市",
        "label": "乌兰察布市"
    }, {"value": "兴安盟", "label": "兴安盟"}, {"value": "锡林郭勒盟", "label": "锡林郭勒盟"}, {"value": "阿拉善盟", "label": "阿拉善盟"}]
}, {
    "value": "辽宁省",
    "label": "辽宁省",
    "children": [{"value": "沈阳市", "label": "沈阳市"}, {"value": "大连市", "label": "大连市"}, {
        "value": "鞍山市",
        "label": "鞍山市"
    }, {"value": "抚顺市", "label": "抚顺市"}, {"value": "本溪市", "label": "本溪市"}, {
        "value": "丹东市",
        "label": "丹东市"
    }, {"value": "锦州市", "label": "锦州市"}, {"value": "营口市", "label": "营口市"}, {
        "value": "阜新市",
        "label": "阜新市"
    }, {"value": "辽阳市", "label": "辽阳市"}, {"value": "盘锦市", "label": "盘锦市"}, {
        "value": "铁岭市",
        "label": "铁岭市"
    }, {"value": "朝阳市", "label": "朝阳市"}, {"value": "葫芦岛市", "label": "葫芦岛市"}]
}, {
    "value": "吉林省",
    "label": "吉林省",
    "children": [{"value": "长春市", "label": "长春市"}, {"value": "吉林市", "label": "吉林市"}, {
        "value": "四平市",
        "label": "四平市"
    }, {"value": "辽源市", "label": "辽源市"}, {"value": "通化市", "label": "通化市"}, {
        "value": "白山市",
        "label": "白山市"
    }, {"value": "松原市", "label": "松原市"}, {"value": "白城市", "label": "白城市"}, {"value": "延边朝鲜族自治州", "label": "延边朝鲜族自治州"}]
}, {
    "value": "黑龙江省",
    "label": "黑龙江省",
    "children": [{"value": "哈尔滨市", "label": "哈尔滨市"}, {"value": "齐齐哈尔市", "label": "齐齐哈尔市"}, {
        "value": "鸡西市",
        "label": "鸡西市"
    }, {"value": "鹤岗市", "label": "鹤岗市"}, {"value": "双鸭山市", "label": "双鸭山市"}, {
        "value": "大庆市",
        "label": "大庆市"
    }, {"value": "伊春市", "label": "伊春市"}, {"value": "佳木斯市", "label": "佳木斯市"}, {
        "value": "七台河市",
        "label": "七台河市"
    }, {"value": "牡丹江市", "label": "牡丹江市"}, {"value": "黑河市", "label": "黑河市"}, {
        "value": "绥化市",
        "label": "绥化市"
    }, {"value": "大兴安岭地区", "label": "大兴安岭地区"}]
}, {
    "value": "上海市",
    "label": "上海市",
    "children": [{"value": "黄浦区", "label": "黄浦区"}, {"value": "徐汇区", "label": "徐汇区"}, {
        "value": "长宁区",
        "label": "长宁区"
    }, {"value": "静安区", "label": "静安区"}, {"value": "普陀区", "label": "普陀区"}, {
        "value": "虹口区",
        "label": "虹口区"
    }, {"value": "杨浦区", "label": "杨浦区"}, {"value": "闵行区", "label": "闵行区"}, {
        "value": "宝山区",
        "label": "宝山区"
    }, {"value": "嘉定区", "label": "嘉定区"}, {"value": "浦东新区", "label": "浦东新区"}, {
        "value": "金山区",
        "label": "金山区"
    }, {"value": "松江区", "label": "松江区"}, {"value": "青浦区", "label": "青浦区"}, {
        "value": "奉贤区",
        "label": "奉贤区"
    }, {"value": "崇明区", "label": "崇明区"}]
}, {
    "value": "江苏省",
    "label": "江苏省",
    "children": [{"value": "南京市", "label": "南京市"}, {"value": "无锡市", "label": "无锡市"}, {
        "value": "徐州市",
        "label": "徐州市"
    }, {"value": "常州市", "label": "常州市"}, {"value": "苏州市", "label": "苏州市"}, {
        "value": "南通市",
        "label": "南通市"
    }, {"value": "连云港市", "label": "连云港市"}, {"value": "淮安市", "label": "淮安市"}, {
        "value": "盐城市",
        "label": "盐城市"
    }, {"value": "扬州市", "label": "扬州市"}, {"value": "镇江市", "label": "镇江市"}, {
        "value": "泰州市",
        "label": "泰州市"
    }, {"value": "宿迁市", "label": "宿迁市"}]
}, {
    "value": "浙江省",
    "label": "浙江省",
    "children": [{"value": "杭州市", "label": "杭州市"}, {"value": "宁波市", "label": "宁波市"}, {
        "value": "温州市",
        "label": "温州市"
    }, {"value": "嘉兴市", "label": "嘉兴市"}, {"value": "湖州市", "label": "湖州市"}, {
        "value": "绍兴市",
        "label": "绍兴市"
    }, {"value": "金华市", "label": "金华市"}, {"value": "衢州市", "label": "衢州市"}, {
        "value": "舟山市",
        "label": "舟山市"
    }, {"value": "台州市", "label": "台州市"}, {"value": "丽水市", "label": "丽水市"}]
}, {
    "value": "安徽省",
    "label": "安徽省",
    "children": [{"value": "合肥市", "label": "合肥市"}, {"value": "芜湖市", "label": "芜湖市"}, {
        "value": "蚌埠市",
        "label": "蚌埠市"
    }, {"value": "淮南市", "label": "淮南市"}, {"value": "马鞍山市", "label": "马鞍山市"}, {
        "value": "淮北市",
        "label": "淮北市"
    }, {"value": "铜陵市", "label": "铜陵市"}, {"value": "安庆市", "label": "安庆市"}, {
        "value": "黄山市",
        "label": "黄山市"
    }, {"value": "滁州市", "label": "滁州市"}, {"value": "阜阳市", "label": "阜阳市"}, {
        "value": "宿州市",
        "label": "宿州市"
    }, {"value": "六安市", "label": "六安市"}, {"value": "亳州市", "label": "亳州市"}, {
        "value": "池州市",
        "label": "池州市"
    }, {"value": "宣城市", "label": "宣城市"}]
}, {
    "value": "福建省",
    "label": "福建省",
    "children": [{"value": "福州市", "label": "福州市"}, {"value": "厦门市", "label": "厦门市"}, {
        "value": "莆田市",
        "label": "莆田市"
    }, {"value": "三明市", "label": "三明市"}, {"value": "泉州市", "label": "泉州市"}, {
        "value": "漳州市",
        "label": "漳州市"
    }, {"value": "南平市", "label": "南平市"}, {"value": "龙岩市", "label": "龙岩市"}, {"value": "宁德市", "label": "宁德市"}]
}, {
    "value": "江西省",
    "label": "江西省",
    "children": [{"value": "南昌市", "label": "南昌市"}, {"value": "景德镇市", "label": "景德镇市"}, {
        "value": "萍乡市",
        "label": "萍乡市"
    }, {"value": "九江市", "label": "九江市"}, {"value": "新余市", "label": "新余市"}, {
        "value": "鹰潭市",
        "label": "鹰潭市"
    }, {"value": "赣州市", "label": "赣州市"}, {"value": "吉安市", "label": "吉安市"}, {
        "value": "宜春市",
        "label": "宜春市"
    }, {"value": "抚州市", "label": "抚州市"}, {"value": "上饶市", "label": "上饶市"}]
}, {
    "value": "山东省",
    "label": "山东省",
    "children": [{"value": "济南市", "label": "济南市"}, {"value": "青岛市", "label": "青岛市"}, {
        "value": "淄博市",
        "label": "淄博市"
    }, {"value": "枣庄市", "label": "枣庄市"}, {"value": "东营市", "label": "东营市"}, {
        "value": "烟台市",
        "label": "烟台市"
    }, {"value": "潍坊市", "label": "潍坊市"}, {"value": "济宁市", "label": "济宁市"}, {
        "value": "泰安市",
        "label": "泰安市"
    }, {"value": "威海市", "label": "威海市"}, {"value": "日照市", "label": "日照市"}, {
        "value": "临沂市",
        "label": "临沂市"
    }, {"value": "德州市", "label": "德州市"}, {"value": "聊城市", "label": "聊城市"}, {
        "value": "滨州市",
        "label": "滨州市"
    }, {"value": "菏泽市", "label": "菏泽市"}]
}, {
    "value": "河南省",
    "label": "河南省",
    "children": [{"value": "郑州市", "label": "郑州市"}, {"value": "开封市", "label": "开封市"}, {
        "value": "洛阳市",
        "label": "洛阳市"
    }, {"value": "平顶山市", "label": "平顶山市"}, {"value": "安阳市", "label": "安阳市"}, {
        "value": "鹤壁市",
        "label": "鹤壁市"
    }, {"value": "新乡市", "label": "新乡市"}, {"value": "焦作市", "label": "焦作市"}, {
        "value": "濮阳市",
        "label": "濮阳市"
    }, {"value": "许昌市", "label": "许昌市"}, {"value": "漯河市", "label": "漯河市"}, {
        "value": "三门峡市",
        "label": "三门峡市"
    }, {"value": "南阳市", "label": "南阳市"}, {"value": "商丘市", "label": "商丘市"}, {
        "value": "信阳市",
        "label": "信阳市"
    }, {"value": "周口市", "label": "周口市"}, {"value": "驻马店市", "label": "驻马店市"}]
}, {
    "value": "湖北省",
    "label": "湖北省",
    "children": [{"value": "武汉市", "label": "武汉市"}, {"value": "黄石市", "label": "黄石市"}, {
        "value": "十堰市",
        "label": "十堰市"
    }, {"value": "宜昌市", "label": "宜昌市"}, {"value": "襄阳市", "label": "襄阳市"}, {
        "value": "鄂州市",
        "label": "鄂州市"
    }, {"value": "荆门市", "label": "荆门市"}, {"value": "孝感市", "label": "孝感市"}, {
        "value": "荆州市",
        "label": "荆州市"
    }, {"value": "黄冈市", "label": "黄冈市"}, {"value": "咸宁市", "label": "咸宁市"}, {
        "value": "随州市",
        "label": "随州市"
    }, {"value": "恩施土家族苗族自治州", "label": "恩施土家族苗族自治州"}]
}, {
    "value": "湖南省",
    "label": "湖南省",
    "children": [{"value": "长沙市", "label": "长沙市"}, {"value": "株洲市", "label": "株洲市"}, {
        "value": "湘潭市",
        "label": "湘潭市"
    }, {"value": "衡阳市", "label": "衡阳市"}, {"value": "邵阳市", "label": "邵阳市"}, {
        "value": "岳阳市",
        "label": "岳阳市"
    }, {"value": "常德市", "label": "常德市"}, {"value": "张家界市", "label": "张家界市"}, {
        "value": "益阳市",
        "label": "益阳市"
    }, {"value": "郴州市", "label": "郴州市"}, {"value": "永州市", "label": "永州市"}, {
        "value": "怀化市",
        "label": "怀化市"
    }, {"value": "娄底市", "label": "娄底市"}, {"value": "湘西土家族苗族自治州", "label": "湘西土家族苗族自治州"}]
}, {
    "value": "广东省",
    "label": "广东省",
    "children": [{"value": "广州市", "label": "广州市"}, {"value": "韶关市", "label": "韶关市"}, {
        "value": "深圳市",
        "label": "深圳市"
    }, {"value": "珠海市", "label": "珠海市"}, {"value": "汕头市", "label": "汕头市"}, {
        "value": "佛山市",
        "label": "佛山市"
    }, {"value": "江门市", "label": "江门市"}, {"value": "湛江市", "label": "湛江市"}, {
        "value": "茂名市",
        "label": "茂名市"
    }, {"value": "肇庆市", "label": "肇庆市"}, {"value": "惠州市", "label": "惠州市"}, {
        "value": "梅州市",
        "label": "梅州市"
    }, {"value": "汕尾市", "label": "汕尾市"}, {"value": "河源市", "label": "河源市"}, {
        "value": "阳江市",
        "label": "阳江市"
    }, {"value": "清远市", "label": "清远市"}, {"value": "东莞市", "label": "东莞市"}, {
        "value": "中山市",
        "label": "中山市"
    }, {"value": "潮州市", "label": "潮州市"}, {"value": "揭阳市", "label": "揭阳市"}, {"value": "云浮市", "label": "云浮市"}]
}, {
    "value": "广西壮族自治区",
    "label": "广西壮族自治区",
    "children": [{"value": "南宁市", "label": "南宁市"}, {"value": "柳州市", "label": "柳州市"}, {
        "value": "桂林市",
        "label": "桂林市"
    }, {"value": "梧州市", "label": "梧州市"}, {"value": "北海市", "label": "北海市"}, {
        "value": "防城港市",
        "label": "防城港市"
    }, {"value": "钦州市", "label": "钦州市"}, {"value": "贵港市", "label": "贵港市"}, {
        "value": "玉林市",
        "label": "玉林市"
    }, {"value": "百色市", "label": "百色市"}, {"value": "贺州市", "label": "贺州市"}, {
        "value": "河池市",
        "label": "河池市"
    }, {"value": "来宾市", "label": "来宾市"}, {"value": "崇左市", "label": "崇左市"}]
}, {
    "value": "海南省",
    "label": "海南省",
    "children": [{"value": "海口市", "label": "海口市"}, {"value": "三亚市", "label": "三亚市"}, {
        "value": "三沙市",
        "label": "三沙市"
    }, {"value": "儋州市", "label": "儋州市"}]
}, {
    "value": "重庆市",
    "label": "重庆市",
    "children": [{"value": "万州区", "label": "万州区"}, {"value": "涪陵区", "label": "涪陵区"}, {
        "value": "渝中区",
        "label": "渝中区"
    }, {"value": "大渡口区", "label": "大渡口区"}, {"value": "江北区", "label": "江北区"}, {
        "value": "沙坪坝区",
        "label": "沙坪坝区"
    }, {"value": "九龙坡区", "label": "九龙坡区"}, {"value": "南岸区", "label": "南岸区"}, {
        "value": "北碚区",
        "label": "北碚区"
    }, {"value": "綦江区", "label": "綦江区"}, {"value": "大足区", "label": "大足区"}, {
        "value": "渝北区",
        "label": "渝北区"
    }, {"value": "巴南区", "label": "巴南区"}, {"value": "黔江区", "label": "黔江区"}, {
        "value": "长寿区",
        "label": "长寿区"
    }, {"value": "江津区", "label": "江津区"}, {"value": "合川区", "label": "合川区"}, {
        "value": "永川区",
        "label": "永川区"
    }, {"value": "南川区", "label": "南川区"}, {"value": "璧山区", "label": "璧山区"}, {
        "value": "铜梁区",
        "label": "铜梁区"
    }, {"value": "潼南区", "label": "潼南区"}, {"value": "荣昌区", "label": "荣昌区"}, {
        "value": "开州区",
        "label": "开州区"
    }, {"value": "梁平区", "label": "梁平区"}, {"value": "武隆区", "label": "武隆区"}, {
        "value": "城口县",
        "label": "城口县"
    }, {"value": "丰都县", "label": "丰都县"}, {"value": "垫江县", "label": "垫江县"}, {
        "value": "忠县",
        "label": "忠县"
    }, {"value": "云阳县", "label": "云阳县"}, {"value": "奉节县", "label": "奉节县"}, {
        "value": "巫山县",
        "label": "巫山县"
    }, {"value": "巫溪县", "label": "巫溪县"}, {"value": "石柱土家族自治县", "label": "石柱土家族自治县"}, {
        "value": "秀山土家族苗族自治县",
        "label": "秀山土家族苗族自治县"
    }, {"value": "酉阳土家族苗族自治县", "label": "酉阳土家族苗族自治县"}, {"value": "彭水苗族土家族自治县", "label": "彭水苗族土家族自治县"}]
}, {
    "value": "四川省",
    "label": "四川省",
    "children": [{"value": "成都市", "label": "成都市"}, {"value": "自贡市", "label": "自贡市"}, {
        "value": "攀枝花市",
        "label": "攀枝花市"
    }, {"value": "泸州市", "label": "泸州市"}, {"value": "德阳市", "label": "德阳市"}, {
        "value": "绵阳市",
        "label": "绵阳市"
    }, {"value": "广元市", "label": "广元市"}, {"value": "遂宁市", "label": "遂宁市"}, {
        "value": "内江市",
        "label": "内江市"
    }, {"value": "乐山市", "label": "乐山市"}, {"value": "南充市", "label": "南充市"}, {
        "value": "眉山市",
        "label": "眉山市"
    }, {"value": "宜宾市", "label": "宜宾市"}, {"value": "广安市", "label": "广安市"}, {
        "value": "达州市",
        "label": "达州市"
    }, {"value": "雅安市", "label": "雅安市"}, {"value": "巴中市", "label": "巴中市"}, {
        "value": "资阳市",
        "label": "资阳市"
    }, {"value": "阿坝藏族羌族自治州", "label": "阿坝藏族羌族自治州"}, {"value": "甘孜藏族自治州", "label": "甘孜藏族自治州"}, {
        "value": "凉山彝族自治州",
        "label": "凉山彝族自治州"
    }]
}, {
    "value": "贵州省",
    "label": "贵州省",
    "children": [{"value": "贵阳市", "label": "贵阳市"}, {"value": "六盘水市", "label": "六盘水市"}, {
        "value": "遵义市",
        "label": "遵义市"
    }, {"value": "安顺市", "label": "安顺市"}, {"value": "毕节市", "label": "毕节市"}, {
        "value": "铜仁市",
        "label": "铜仁市"
    }, {"value": "黔西南布依族苗族自治州", "label": "黔西南布依族苗族自治州"}, {
        "value": "黔东南苗族侗族自治州",
        "label": "黔东南苗族侗族自治州"
    }, {"value": "黔南布依族苗族自治州", "label": "黔南布依族苗族自治州"}]
}, {
    "value": "云南省",
    "label": "云南省",
    "children": [{"value": "昆明市", "label": "昆明市"}, {"value": "曲靖市", "label": "曲靖市"}, {
        "value": "玉溪市",
        "label": "玉溪市"
    }, {"value": "保山市", "label": "保山市"}, {"value": "昭通市", "label": "昭通市"}, {
        "value": "丽江市",
        "label": "丽江市"
    }, {"value": "普洱市", "label": "普洱市"}, {"value": "临沧市", "label": "临沧市"}, {
        "value": "楚雄彝族自治州",
        "label": "楚雄彝族自治州"
    }, {"value": "红河哈尼族彝族自治州", "label": "红河哈尼族彝族自治州"}, {
        "value": "文山壮族苗族自治州",
        "label": "文山壮族苗族自治州"
    }, {"value": "西双版纳傣族自治州", "label": "西双版纳傣族自治州"}, {"value": "大理白族自治州", "label": "大理白族自治州"}, {
        "value": "德宏傣族景颇族自治州",
        "label": "德宏傣族景颇族自治州"
    }, {"value": "怒江傈僳族自治州", "label": "怒江傈僳族自治州"}, {"value": "迪庆藏族自治州", "label": "迪庆藏族自治州"}]
}, {
    "value": "西藏自治区",
    "label": "西藏自治区",
    "children": [{"value": "拉萨市", "label": "拉萨市"}, {"value": "日喀则市", "label": "日喀则市"}, {
        "value": "昌都市",
        "label": "昌都市"
    }, {"value": "林芝市", "label": "林芝市"}, {"value": "山南市", "label": "山南市"}, {
        "value": "那曲市",
        "label": "那曲市"
    }, {"value": "阿里地区", "label": "阿里地区"}]
}, {
    "value": "陕西省",
    "label": "陕西省",
    "children": [{"value": "西安市", "label": "西安市"}, {"value": "铜川市", "label": "铜川市"}, {
        "value": "宝鸡市",
        "label": "宝鸡市"
    }, {"value": "咸阳市", "label": "咸阳市"}, {"value": "渭南市", "label": "渭南市"}, {
        "value": "延安市",
        "label": "延安市"
    }, {"value": "汉中市", "label": "汉中市"}, {"value": "榆林市", "label": "榆林市"}, {
        "value": "安康市",
        "label": "安康市"
    }, {"value": "商洛市", "label": "商洛市"}]
}, {
    "value": "甘肃省",
    "label": "甘肃省",
    "children": [{"value": "兰州市", "label": "兰州市"}, {"value": "嘉峪关市", "label": "嘉峪关市"}, {
        "value": "金昌市",
        "label": "金昌市"
    }, {"value": "白银市", "label": "白银市"}, {"value": "天水市", "label": "天水市"}, {
        "value": "武威市",
        "label": "武威市"
    }, {"value": "张掖市", "label": "张掖市"}, {"value": "平凉市", "label": "平凉市"}, {
        "value": "酒泉市",
        "label": "酒泉市"
    }, {"value": "庆阳市", "label": "庆阳市"}, {"value": "定西市", "label": "定西市"}, {
        "value": "陇南市",
        "label": "陇南市"
    }, {"value": "临夏回族自治州", "label": "临夏回族自治州"}, {"value": "甘南藏族自治州", "label": "甘南藏族自治州"}]
}, {
    "value": "青海省",
    "label": "青海省",
    "children": [{"value": "西宁市", "label": "西宁市"}, {"value": "海东市", "label": "海东市"}, {
        "value": "海北藏族自治州",
        "label": "海北藏族自治州"
    }, {"value": "黄南藏族自治州", "label": "黄南藏族自治州"}, {"value": "海南藏族自治州", "label": "海南藏族自治州"}, {
        "value": "果洛藏族自治州",
        "label": "果洛藏族自治州"
    }, {"value": "玉树藏族自治州", "label": "玉树藏族自治州"}, {"value": "海西蒙古族藏族自治州", "label": "海西蒙古族藏族自治州"}]
}, {
    "value": "宁夏回族自治区",
    "label": "宁夏回族自治区",
    "children": [{"value": "银川市", "label": "银川市"}, {"value": "石嘴山市", "label": "石嘴山市"}, {
        "value": "吴忠市",
        "label": "吴忠市"
    }, {"value": "固原市", "label": "固原市"}, {"value": "中卫市", "label": "中卫市"}]
}, {
    "value": "新疆维吾尔自治区",
    "label": "新疆维吾尔自治区",
    "children": [{"value": "乌鲁木齐市", "label": "乌鲁木齐市"}, {"value": "克拉玛依市", "label": "克拉玛依市"}, {
        "value": "吐鲁番市",
        "label": "吐鲁番市"
    }, {"value": "哈密市", "label": "哈密市"}, {"value": "昌吉回族自治州", "label": "昌吉回族自治州"}, {
        "value": "博尔塔拉蒙古自治州",
        "label": "博尔塔拉蒙古自治州"
    }, {"value": "巴音郭楞蒙古自治州", "label": "巴音郭楞蒙古自治州"}, {"value": "阿克苏地区", "label": "阿克苏地区"}, {
        "value": "克孜勒苏柯尔克孜自治州",
        "label": "克孜勒苏柯尔克孜自治州"
    }, {"value": "喀什地区", "label": "喀什地区"}, {"value": "和田地区", "label": "和田地区"}, {
        "value": "伊犁哈萨克自治州",
        "label": "伊犁哈萨克自治州"
    }, {"value": "塔城地区", "label": "塔城地区"}, {"value": "阿勒泰地区", "label": "阿勒泰地区"}]
}, {"value": "台湾省", "label": "台湾省", "children": []}, {
    "value": "香港特别行政区",
    "label": "香港特别行政区",
    "children": []
}, {"value": "澳门特别行政区", "label": "澳门特别行政区", "children": []}];
let level1 = [{"value": "北京", "label": "北京"}, {"value": "天津", "label": "天津"}, {
    "value": "河北",
    "label": "河北"
}, {"value": "山西", "label": "山西"}, {"value": "内蒙古", "label": "内蒙古"}, {"value": "辽宁", "label": "辽宁"}, {
    "value": "吉林",
    "label": "吉林"
}, {"value": "黑龙江", "label": "黑龙江"}, {"value": "上海", "label": "上海"}, {"value": "江苏", "label": "江苏"}, {
    "value": "浙江",
    "label": "浙江"
}, {"value": "安徽", "label": "安徽"}, {"value": "福建", "label": "福建"}, {"value": "江西", "label": "江西"}, {
    "value": "山东",
    "label": "山东"
}, {"value": "河南", "label": "河南"}, {"value": "湖北", "label": "湖北"}, {"value": "湖南", "label": "湖南"}, {
    "value": "广东",
    "label": "广东"
}, {"value": "广西", "label": "广西"}, {"value": "海南", "label": "海南"}, {"value": "重庆", "label": "重庆"}, {
    "value": "四川",
    "label": "四川"
}, {"value": "贵州", "label": "贵州"}, {"value": "云南", "label": "云南"}, {"value": "西藏", "label": "西藏"}, {
    "value": "陕西",
    "label": "陕西"
}, {"value": "甘肃", "label": "甘肃"}, {"value": "青海", "label": "青海"}, {"value": "宁夏", "label": "宁夏"}, {
    "value": "新疆",
    "label": "新疆"
}, {"value": "台湾", "label": "台湾"}, {"value": "香港", "label": "香港"}, {"value": "澳门", "label": "澳门"}, {
    "value": "海外",
    "label": "海外"
}];

export default PersonPage;