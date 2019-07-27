# YAFrameworkForCocosCreator
YAFramework一个基于CocosCreator的游戏框架，里面集合了几个方块游戏。

# 目录结构说明
```
assets 项目资源和代码   
    resources 资源目录   
    |     prefabs 	用于存放prefab   
    |     sounds 	用于存放音效、bgm   
    |     textures 	用于存放游戏  
    |     |     game 	游戏资源  
    |     |     unity 	通用资源  
    scenes 场景文件  
    scripts 脚本  
    |     components  	通用的组件
    |     |     event  	事件派发类
    |     |     music  	音效播放类
    |     |     mvc  	mvc框架
    |     |     storage 本地存储
    |     configs  	游戏配置
    |     managers  各种管理类
    |     models  	model数据
    |     modules  	模块
    |     platforms 平台接口
    |     utils  	通用的帮助类
    |     widgets  
    launcher 游戏启动入口脚本  
```

# 项目框架说明
YAFramework是一个简单的MVC框架，采用单一游戏场景，所以只会存在一个场景文件，假如是main.fire，在场景中一开始只会创建3个节点，也是3个层级：layerView、layerDialog、layerTop，游戏中所有的物件都应该它们的子节点。   
游戏入口脚本是launcher.js，负责各种管理类、配置脚本、通用组件等的初始化工作。

## MVC框架
M数据缓存，V视图展示，C交互控制  
M的基类是Model  
V的基类是View、Dialog  
C的基类是Controller  
### Model
所有模块的M都应该继承此类，用于数据的解析、缓存。
### View
如果视图是全屏类型或者说可以当成场景来看，那么就需要继承View，此视图基类只定义了最基本的初始化流程。
### Dialog
如果视图是弹窗类型或者可以理解成弹窗，那么就需要继承此类Dialog，所有此类的子类都应该受到DialogManager的管理，其生命周期（创建、关闭）也应该受到DialogManager的监管。  
Dialog基类定义并实现了大量通用的方法，降低了弹窗类型的视图操作复杂度，和使用上的麻烦。
### Controller
所有模块的C都应该继承此类。  
如果模块只是弹窗类型，其中有用的方法只有initGlobalEvent。

## 模块管理器ModuleManager
所有的Controller都会在此管理器中被引用，并被初始化。
它控制全屏视图模块或场景的生命周期（创建、关闭）。

## 弹窗管理器DialogManager

## 资源管理器ResourceManager
