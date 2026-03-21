export const AttributeTag=[
    {id:0, name:'无基础属性'},
    {id:1, name:'敏捷提升'},
    {id:2, name:'力量提升'},
    {id:3, name:'意志提升'},
    {id:4, name:'智识提升'},
    {id:5, name:'主能力提升'},
]

export const SecondaryTag=[
    {id:0, name:'无附加属性'},
    {id:1, name:'攻击提升'},
    {id:2, name:'生命提升'},
    {id:3, name:'物理伤害提升'},
    {id:4, name:'法术提升'},
    {id:5, name:'灼热伤害提升'},
    {id:6, name:'电磁伤害提升'},
    {id:7, name:'寒冷伤害提升'},
    {id:8, name:'自然伤害提升'},
    {id:9, name:'暴击率提升'},
    {id:10, name:'源石技艺提升'},
    {id:11, name:'终结技效率提升'},
    {id:12, name:'治疗效率提升'},
]

export const SkillsTag=[
    {id:0, name:'无技能属性'},
    {id:1, name:'强攻'},
    {id:2, name:'压制'},
    {id:3, name:'追袭'},
    {id:4, name:'巧技'},
    {id:5, name:'昂扬'},
    {id:6, name:'夜幕'},
    {id:7, name:'流转'},
    {id:8, name:'附术'},
    {id:9, name:'效益'},
    {id:10, name:'医疗'},
    {id:11, name:'残暴'},
    {id:12, name:'切骨'},
    {id:13, name:'迸发'},
    {id:14, name:'粉碎'},
]

export const weapons=[

    //单手剑
    {id:1001, name:'塔尔11',type:'单手剑',rank:3,attribute:AttributeTag[5],secondary:SecondaryTag[0],skills:SkillsTag[1]},
    {id:1002, name:'应急手段',type:'单手剑',rank:4,attribute:AttributeTag[1],secondary:SecondaryTag[3],skills:SkillsTag[2]},
    {id:1003, name:'浪潮',type:'单手剑',rank:4,attribute:AttributeTag[4],secondary:SecondaryTag[1],skills:SkillsTag[3]},
    {id:1004, name:'钢铁余音',type:'单手剑',rank:5,attribute:AttributeTag[1],secondary:SecondaryTag[3],skills:SkillsTag[4]},
    {id:1005, name:'坚城铸造者',type:'单手剑',rank:5,attribute:AttributeTag[4],secondary:SecondaryTag[11],skills:SkillsTag[5]},
    {id:1006, name:'逐鳞3.0',type:'单手剑',rank:5,attribute:AttributeTag[2],secondary:SecondaryTag[7],skills:SkillsTag[2]},
    {id:1007, name:'十二问',type:'单手剑',rank:5,attribute:AttributeTag[1],secondary:SecondaryTag[1],skills:SkillsTag[8]},
    {id:1008, name:'O.B.J轻芒',type:'单手剑',rank:5,attribute:AttributeTag[1],secondary:SecondaryTag[1],skills:SkillsTag[7]},
    {id:1009, name:'仰止',type:'单手剑',rank:5,attribute:AttributeTag[1],secondary:SecondaryTag[3],skills:SkillsTag[6]},
    {id:1010, name:'宏愿',type:'单手剑',rank:6,attribute:AttributeTag[1],secondary:SecondaryTag[1],skills:SkillsTag[8]},
    {id:1011, name:'不知归',type:'单手剑',rank:6,attribute:AttributeTag[3],secondary:SecondaryTag[1],skills:SkillsTag[7]},
    {id:1012, name:'熔铸火焰',type:'单手剑',rank:6,attribute:AttributeTag[4],secondary:SecondaryTag[1],skills:SkillsTag[6]},
    {id:1013, name:'黯色火炬',type:'单手剑',rank:6,attribute:AttributeTag[4],secondary:SecondaryTag[5],skills:SkillsTag[8]},
    {id:1014, name:'扶摇',type:'单手剑',rank:6,attribute:AttributeTag[5],secondary:SecondaryTag[9],skills:SkillsTag[6]},
    {id:1015, name:'热熔切割器',type:'单手剑',rank:6,attribute:AttributeTag[3],secondary:SecondaryTag[1],skills:SkillsTag[7]},
    {id:1016, name:'显赫声名',type:'单手剑',rank:6,attribute:AttributeTag[5],secondary:SecondaryTag[3],skills:SkillsTag[11]},
    {id:1017, name:'白夜新星',type:'单手剑',rank:6,attribute:AttributeTag[5],secondary:SecondaryTag[10],skills:SkillsTag[9]},
    {id:1018, name:'光荣记忆',type:'单手剑',rank:6,attribute:AttributeTag[1],secondary:SecondaryTag[9],skills:SkillsTag[6]},

    //双手剑
    {id:2001, name:'达尔霍夫',type:'双手剑',rank:3,attribute:AttributeTag[5],secondary:SecondaryTag[0],skills:SkillsTag[1]},
    {id:2002, name:'工业零点一',type:'双手剑',rank:4,attribute:AttributeTag[2],secondary:SecondaryTag[1],skills:SkillsTag[2]},
    {id:2003, name:'淬火者',type:'双手剑',rank:4,attribute:AttributeTag[3],secondary:SecondaryTag[2],skills:SkillsTag[14]},
    {id:2004, name:'探骊',type:'双手剑',rank:5,attribute:AttributeTag[3],secondary:SecondaryTag[2],skills:SkillsTag[13]},
    {id:2005, name:'古渠',type:'双手剑',rank:5,attribute:AttributeTag[2],secondary:SecondaryTag[10],skills:SkillsTag[11]},
    {id:2006, name:'终点之声',type:'双手剑',rank:5,attribute:AttributeTag[2],secondary:SecondaryTag[2],skills:SkillsTag[10]},
    {id:2007, name:'O.B.J重荷',type:'双手剑',rank:5,attribute:AttributeTag[2],secondary:SecondaryTag[2],skills:SkillsTag[10]},
    {id:2008, name:'大雷斑',type:'双手剑',rank:6,attribute:AttributeTag[2],secondary:SecondaryTag[2],skills:SkillsTag[10]},
    {id:2009, name:'赫拉芬格',type:'双手剑',rank:6,attribute:AttributeTag[2],secondary:SecondaryTag[1],skills:SkillsTag[13]},
    {id:2010, name:'典范',type:'双手剑',rank:6,attribute:AttributeTag[5],secondary:SecondaryTag[1],skills:SkillsTag[2]},
    {id:2011, name:'昔日精品',type:'双手剑',rank:6,attribute:AttributeTag[3],secondary:SecondaryTag[2],skills:SkillsTag[9]},
    {id:2012, name:'破碎君王',type:'双手剑',rank:6,attribute:AttributeTag[3],secondary:SecondaryTag[9],skills:SkillsTag[14]},

    //长柄武器
    {id:3001, name:'奥佩罗77',type:'长柄武器',rank:3,attribute:AttributeTag[5],secondary:SecondaryTag[0],skills:SkillsTag[1]},
    {id:3002, name:'寻路者道标',type:'长柄武器',rank:4,attribute:AttributeTag[1],secondary:SecondaryTag[1],skills:SkillsTag[5]},
    {id:3003, name:'天使杀手',type:'长柄武器',rank:4,attribute:AttributeTag[3],secondary:SecondaryTag[4],skills:SkillsTag[2]},
    {id:3004, name:'嵌合正义',type:'长柄武器',rank:5,attribute:AttributeTag[2],secondary:SecondaryTag[11],skills:SkillsTag[11]},
    {id:3005, name:'O.B.J尖峰',type:'长柄武器',rank:5,attribute:AttributeTag[3],secondary:SecondaryTag[3],skills:SkillsTag[8]},
    {id:3006, name:'向心之引',type:'长柄武器',rank:5,attribute:AttributeTag[3],secondary:SecondaryTag[6],skills:SkillsTag[2]},
    {id:3007, name:'负山',type:'长柄武器',rank:6,attribute:AttributeTag[1],secondary:SecondaryTag[3],skills:SkillsTag[9]},
    {id:3008, name:'骁勇',type:'长柄武器',rank:6,attribute:AttributeTag[1],secondary:SecondaryTag[3],skills:SkillsTag[4]},
    {id:3009, name:'J.E.T',type:'长柄武器',rank:6,attribute:AttributeTag[5],secondary:SecondaryTag[1],skills:SkillsTag[2]},

    //手铳
    {id:4001, name:'佩科5',type:'手铳',rank:3,attribute:AttributeTag[5],secondary:SecondaryTag[0],skills:SkillsTag[1]},
    {id:4002, name:'呼啸守卫',type:'手铳',rank:4,attribute:AttributeTag[4],secondary:SecondaryTag[1],skills:SkillsTag[2]},
    {id:4003, name:'长路',type:'手铳',rank:4,attribute:AttributeTag[2],secondary:SecondaryTag[4],skills:SkillsTag[3]},
    {id:4004, name:'作品:众生',type:'手铳',rank:5,attribute:AttributeTag[1],secondary:SecondaryTag[4],skills:SkillsTag[8]},
    {id:4005, name:'O.B.J迅极',type:'手铳',rank:5,attribute:AttributeTag[1],secondary:SecondaryTag[11],skills:SkillsTag[13]},
    {id:4006, name:'理性告别',type:'手铳',rank:5,attribute:AttributeTag[2],secondary:SecondaryTag[5],skills:SkillsTag[3]},
    {id:4007, name:'艺术暴君',type:'手铳',rank:6,attribute:AttributeTag[4],secondary:SecondaryTag[9],skills:SkillsTag[12]},
    {id:4008, name:'领航者',type:'手铳',rank:6,attribute:AttributeTag[4],secondary:SecondaryTag[7],skills:SkillsTag[8]},
    {id:4009, name:'楔子',type:'手铳',rank:6,attribute:AttributeTag[5],secondary:SecondaryTag[9],skills:SkillsTag[8]},
    {id:4010, name:'同类相食',type:'手铳',rank:6,attribute:AttributeTag[5],secondary:SecondaryTag[4],skills:SkillsTag[8]},
    {id:4011, name:'望乡',type:'手铳',rank:6,attribute:AttributeTag[1],secondary:SecondaryTag[7],skills:SkillsTag[2]},
    {id:4012, name:'落草',type:'手铳',rank:6,attribute:AttributeTag[1],secondary:SecondaryTag[1],skills:SkillsTag[13]},

    //施术单元
    {id:5001, name:'吉米尼12',type:'施术单元',rank:3,attribute:AttributeTag[5],secondary:SecondaryTag[0],skills:SkillsTag[1]},
    {id:5002, name:'全自动骇新星',type:'施术单元',rank:4,attribute:AttributeTag[4],secondary:SecondaryTag[4],skills:SkillsTag[5]},
    {id:5003, name:'荧光雷羽',type:'施术单元',rank:4,attribute:AttributeTag[3],secondary:SecondaryTag[1],skills:SkillsTag[2]},
    {id:5004, name:'哀悼诗',type:'施术单元',rank:5,attribute:AttributeTag[4],secondary:SecondaryTag[1],skills:SkillsTag[6]},
    {id:5005, name:'莫奈何',type:'施术单元',rank:5,attribute:AttributeTag[3],secondary:SecondaryTag[11],skills:SkillsTag[5]},
    {id:5006, name:'迷失荒野',type:'施术单元',rank:5,attribute:AttributeTag[4],secondary:SecondaryTag[6],skills:SkillsTag[8]},
    {id:5007, name:'布道自由',type:'施术单元',rank:5,attribute:AttributeTag[3],secondary:SecondaryTag[12],skills:SkillsTag[10]},
    {id:5008, name:'O.B.J术识',type:'施术单元',rank:5,attribute:AttributeTag[4],secondary:SecondaryTag[10],skills:SkillsTag[3]},
    {id:5009, name:'使命必达',type:'施术单元',rank:6,attribute:AttributeTag[3],secondary:SecondaryTag[11],skills:SkillsTag[3]},
    {id:5010, name:'沧溟星梦',type:'施术单元',rank:6,attribute:AttributeTag[4],secondary:SecondaryTag[12],skills:SkillsTag[8]},
    {id:5011, name:'作品:蚀迹',type:'施术单元',rank:6,attribute:AttributeTag[3],secondary:SecondaryTag[8],skills:SkillsTag[2]},
    {id:5012, name:'爆破单元',type:'施术单元',rank:6,attribute:AttributeTag[5],secondary:SecondaryTag[10],skills:SkillsTag[13]},
    {id:5013, name:'遗忘',type:'施术单元',rank:6,attribute:AttributeTag[4],secondary:SecondaryTag[4],skills:SkillsTag[6]},
    {id:5014, name:'骑士精神',type:'施术单元',rank:6,attribute:AttributeTag[3],secondary:SecondaryTag[2],skills:SkillsTag[10]},
]

export const locations=[

    //四号谷地
    {id:101, name:'枢纽区',map:'四号谷地',
        secondary:[SecondaryTag[1],SecondaryTag[5],SecondaryTag[6],SecondaryTag[7],
                    SecondaryTag[8],SecondaryTag[10],SecondaryTag[11],SecondaryTag[4],],
        skills:[SkillsTag[1],SkillsTag[2],SkillsTag[3],SkillsTag[14],
                    SkillsTag[4],SkillsTag[13],SkillsTag[7],SkillsTag[9],]
    },
    {id:102, name:'源石研究院',map:'四号谷地',
        secondary:[SecondaryTag[1],SecondaryTag[3],SecondaryTag[6],SecondaryTag[7],
                    SecondaryTag[8],SecondaryTag[9],SecondaryTag[11],SecondaryTag[4],],
        skills:[SkillsTag[2],SkillsTag[3],SkillsTag[5],SkillsTag[4],
                    SkillsTag[8],SkillsTag[10],SkillsTag[12],SkillsTag[9],]
    },
    {id:103, name:'矿脉源区',map:'四号谷地',
        secondary:[SecondaryTag[2],SecondaryTag[3],SecondaryTag[5],SecondaryTag[7],
                    SecondaryTag[8],SecondaryTag[9],SecondaryTag[11],SecondaryTag[12],],
        skills:[SkillsTag[1],SkillsTag[2],SkillsTag[4],SkillsTag[11],
                    SkillsTag[8],SkillsTag[13],SkillsTag[6],SkillsTag[9],]
    },
    {id:104, name:'供能高地',map:'四号谷地',
        secondary:[SecondaryTag[1],SecondaryTag[2],SecondaryTag[3],SecondaryTag[5],
                    SecondaryTag[8],SecondaryTag[9],SecondaryTag[10],SecondaryTag[12],],
        skills:[SkillsTag[3],SkillsTag[14],SkillsTag[5],SkillsTag[11],
                    SkillsTag[8],SkillsTag[10],SkillsTag[12],SkillsTag[7],]
    },

    //武陵
    {id:201, name:'武陵城',map:'武陵',
        secondary:[SecondaryTag[1],SecondaryTag[2],SecondaryTag[6],SecondaryTag[7],
                    SecondaryTag[9],SecondaryTag[11],SecondaryTag[4],SecondaryTag[12],],
        skills:[SkillsTag[1],SkillsTag[14],SkillsTag[11],SkillsTag[10],
                    SkillsTag[12],SkillsTag[13],SkillsTag[6],SkillsTag[7],]
    },
    {id:202, name:'清波寨',map:'武陵',
        secondary:[SecondaryTag[2],SecondaryTag[3],SecondaryTag[6],SecondaryTag[7],
                    SecondaryTag[10],SecondaryTag[11],SecondaryTag[4],SecondaryTag[12],],
        skills:[SkillsTag[2],SkillsTag[14],SkillsTag[5],SkillsTag[4],
                    SkillsTag[10],SkillsTag[12],SkillsTag[13],SkillsTag[6],]
    },
]

export const getProductsByCategory = (category) => {
  return products.filter(p => p.category === category)
}


export const recommendedWeaponIds = [4012,4007,5009]//填写武器id

export const getRecommendedWeapons = () => {
  return weapons.filter(w => recommendedWeaponIds.includes(w.id))
}