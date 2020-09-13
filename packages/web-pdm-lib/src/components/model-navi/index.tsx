
import { EllipsisOutlined } from '@ant-design/icons';
import { debounce } from 'lodash'

// import { Tree } from '../../tree'
import { TModel } from '../../type/model'
import { RootInstance } from '../../type'
// import _ from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import Scroll from 'react-custom-scrollbars'
import { CreateComponent, intlLiteral } from '../../util'
import { useMst } from '../../context'
import './style.scss'
// import mst from '@antv/g6/lib/algorithm/mst';




type IModelNaviProps = {
  modules?: [],
  model?: []
}

 const getTreeNodeTitle = (model: TModel, root : RootInstance, OptionBuilder: any ) => {
     return <OptionBuilder data={{
      title: root.renderModelTitle(model) ,
     
      options: [{
        title: <span> {intlLiteral('定位模型')}</span>,
        click: (e) =>  {  root.sys.centerCurrentModel([model.id]) ;    e.stopPropagation(); } ,
      },
      {
        title: <span> {intlLiteral('查看')}</span>
      },
      // {
      //   title: <span> {intlLiteral('移除')}</span>
      // },
    ],
    }} />
 }


export default CreateComponent<IModelNaviProps>(
  {
    render(_) {
     
      const mst = useMst()
      useEffect(()=>{ }, [mst.Ui.update])
      const { Input, Button, Dropdown, Menu,Select, Tree }  = mst.Ui as any
      const { TreeNode, OptionBuilder } = Tree as any
      const { search ,onExpand, checkAllFun, checkAllCancleFun, toggleShowNameOrLabel, toggleTabOrTree, Sys, changeModuleValue, setSearch } = useLocal()
      return <div className='console-models-tree' style={{height: mst.sys.height}}>
        <div className='header'>
          <div className='console-erd-search'>
            <Input allowClear value={search} size="small" onChange={(e) => setSearch(e.target.value)} addonAfter={
                Sys.tabOrTree && <Select size="small" defaultValue={Sys.currentModule} value={Sys.currentModule}  className="select-after" onChange={changeModuleValue}>
                {
                  [
                    <Select.Option value={''}>所有</Select.Option>,
                    ...([...mst.Modules.values()].map((module) => {
                    return  <Select.Option value={module.id} key={module.id}>{module.label}</Select.Option>
                    }))
                  ]
                }
              </Select>
            } />
          </div>
          <div className='console-erd-search btns'>
            {mst.sys.tabOrTree && <Button size="small" type="text" onClick={checkAllFun} >选择所有</Button>}
            {mst.sys.tabOrTree && <Button size="small" type="text" onClick={checkAllCancleFun}>清除所有</Button>}
            {/* {!mst.sys.tabOrTree && <Button size="small" type="link" onClick={toggleTabOrTree}>{mst.sys.tabOrTree?'分类':'树形'}模式</Button>} */}
            <Button size="small" type="text" onClick={toggleShowNameOrLabel}>显示{!mst.sys.showNameOrLabel?'名称':'标签'}</Button>
            {<Dropdown  className='right' overlay={<Menu>
            <Menu.Item key="1" onClick={toggleTabOrTree}>{Sys.tabOrTree?'分类':'树形'}模式</Menu.Item>
             </Menu>}>
             <span><EllipsisOutlined/></span>
            </Dropdown>}
          </div>
        </div>
        <div className='navitree-warp'>
          <Scroll autoHide autoHeight autoHideTimeout={1000} autoHideDuration={200} autoHeightMin={'100%'} autoHeightMax={'100%'} >
           <Tree showIcon={false} className='console-models-tree-tree' onSelect={mst.sys.setCurrentModel.bind(mst.sys)} selectedKeys={[mst.sys.currentModel]} checkedKeys={[...mst.sys.checkedKeys]} onCheck={mst.setCheckedKeys.bind(mst)}  checkable onExpand={onExpand}  multiple  expandedKeys={[...mst.sys.expandedKeys]} >
              {
                !mst.sys.tabOrTree && mst.moduleList.map(m => {
                  return (
                    <TreeNode title={mst.sys.showNameOrLabel ? m.name : m.label} key={m.id}>
                       {[...m.models.values()].filter(model => model.filterModel() ).map(model => {
                         return  <TreeNode key={model.id} title={getTreeNodeTitle(model, mst, OptionBuilder)} />
                       })}
                    </TreeNode>
                  )
                })
              }
              {  
                mst.sys.tabOrTree && [...mst.Models.values()].filter(model=> ((!mst.sys.currentModule || model.moduleId === mst.sys.currentModule) && model.filterModel())).map(model => {
                  return  <TreeNode key={model.id} title={getTreeNodeTitle(model, mst, OptionBuilder)} />
                })
              }
            </Tree>
          
          </Scroll>
        </div>
      </div>

    },
    displayName: 'navi'
  }
)

const useLocal = () => {
  const mst = useMst()
  const [text, setText] = useState(mst.sys.search)
  const [texting, setTexting]= useState(false)
  useEffect(()=>{ if(!texting) debounce(()=>setText(mst.sys.search), 1000)() }, [mst.sys.search])

  const setSearch = useCallback( (val) => { 
    setTexting(true)
    setText(val)
    debounce(
      ()=> { 
        mst.sys.setSearch(val);
        setTexting(false)
      }, 500)() 
  }, [mst.sys.setSearch, setText]);
  // const setSearch = mst.sys.setSearch;
  return {
    search: text ,
    get modules() { 
        return mst.moduleList
      },
   onExpand(expandedKeys: string[]) {
      mst.sys.setExpandedKeys(expandedKeys)
    },

    get expandedKeys() {
      return mst.sys.expandedKeys
    },
    checkAllFun() {
       return mst.checkAllFun()
    },
    checkAllCancleFun() {
      return mst.checkAllCancleFun()
    },
    toggleShowNameOrLabel: mst.sys.toggleShowNameOrLabel,
    toggleTabOrTree : mst.sys.toggleTabOrTree.bind(mst.sys),
    get Sys() {
       return mst.sys
    },
    changeModuleValue: mst.sys.changeModuleValue.bind(mst.sys),
    setSearch 

  }
}
