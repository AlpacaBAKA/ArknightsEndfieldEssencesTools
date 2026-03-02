

# 明日方舟：终末地基质刷取工具

这是一个辅助明日方舟：终末地中基质刷取的工具，用于计算基质刷取的最优解。

本网站基于react框架开发，使用claude辅助开发。

网站地址：https://alpacabaka.github.io/ArknightsEndfieldEssencesTools/
github地址：https://github.com/AlpacaBAKA/ArknightsEndfieldEssencesTools

## 使用方法

进入网页后页面如图，默认停留在刷取策略查询界面。

![image-20260302211520992](C:\Users\AlpacaPAKA\AppData\Roaming\Typora\typora-user-images\image-20260302211520992.png)

### 1. 刷取策略计算

本功能用于计算刷取基质最优解。

在最中央的输入框中输入需要刷取的武器，如果有其他需要同时刷取的武器，可以填写在下方的任意一个输入框中。最多支持计算同时刷取3个武器的情况。
以熔铸火焰为例，输入“熔铸火焰”并点击查询后会计算出结果。下方会罗列出所有会出熔铸火焰基质的副本。点击“显示所有策略”按钮会从显示所有策略的页面和只显示最优解的页面之间切换。最优解的判定为能够刷取最多的武器（包括4星在内）
![image-20260302211734963](C:\Users\AlpacaPAKA\AppData\Roaming\Typora\typora-user-images\image-20260302211734963.png)

### 2. 武器属性筛选

本功能用于计算哪些副本可以同时刷取多个武器的基质。

在主页面点击“武器属性筛选”页面后，即可进入本功能页面。本页面主体为一个表格和筛选条件。
![image-20260302212145125](C:\Users\AlpacaPAKA\AppData\Roaming\Typora\typora-user-images\image-20260302212145125.png)

通过选择筛选条件可以快速筛选武器。同时，点击表头也可以按照选择的表头属性进行排序。默认排序方式为id。

在表格最左侧的复选框可以选择希望刷取的武器。随后拉到页面最下方，会显示计算结果———能够刷取的地点和能够固定的词条
![image-20260302212506473](C:\Users\AlpacaPAKA\AppData\Roaming\Typora\typora-user-images\image-20260302212506473.png)

## 功能反馈

如果你在使用的过程中遇到了严重的bug，或者说希望增加新的功能，你可以：

1. 在小黑盒文章下留言，或者私信我
2. 在github项目页上留言

这个项目还不成熟，如有错漏，请多包容。
