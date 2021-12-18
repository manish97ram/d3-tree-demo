import logo from './logo.svg';
import './App.css';
import Tree from "react-d3-tree";
import { useCenteredTree } from './helpers';
import orgChartJson from "./data/demo.json";
import { useState } from 'react';

const nodeBoxStyles = {
  border: '1px solid #d0cfcf',
  backgroundColor: 'rgb(255, 255, 255)',
  borderRadius: '6px',
  boxShadow: '3px 2px 7px -2px #8080806b',
  margin: '3px',
  marginTop: 0,
  position: 'relative'
}

const nodeDescBoxStyles = {
  display: 'flex',
  flexWrap: 'nowrap',
  padding: '10px 10px'
}

const nodeIconBoxStyles = {
  display: 'flex',
  alignItems: 'center'
}

const nodeInnerDescStyles = {
  paddingLeft: '10px'
}

const nodeTitleStyles = {
  marginTop: 0,
  marginBottom: '2px',
  lineHeight: '1.4',
  fontSize: '16px'
}

const nodeShortDescStyles = {
  fontSize: '12px',
  color: '#7a7979',
  margin: 0
}

const nodeExpandIconStyles = {
  transform: 'rotate(90deg)',
  display: 'block'
}

const nodeCollapseIconStyles = {
  transform: 'rotate(-90deg)',
  display: 'block'
}

const nodeToggleButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const addNodeButtonStyles = {
  display: 'block',
  margin: '-27px 10px 10px auto'
}

const containerStyles = {
  width: "100vw",
  height: "100vh"
};

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  addChildren,
  loading
}) => (
  <g>
    {/* <circle r={100}></circle> */}
    
    {/* `foreignObject` requires width & height to be explicitly set. */}
    <foreignObject {...foreignObjectProps}>
      <div style={nodeBoxStyles}>
        <div style={nodeDescBoxStyles} >
          <div style={nodeIconBoxStyles}><img src="https://via.placeholder.com/30" /></div>
          <div style={nodeInnerDescStyles}>
            <h3 style={nodeTitleStyles}>{nodeDatum.name}</h3>
            <p style={nodeShortDescStyles}>lorem ipsum</p>
          </div>
        </div>
        {/* <h3 style={{ textAlign: "center" }}>{nodeDatum.name}</h3> */}
        {
          !nodeDatum.children ?
          <button className='actionButton' disabled={loading} style={addNodeButtonStyles} onClick={()=>addChildren(nodeDatum)}>
            +
          </button> : ''
        }
        
        {nodeDatum.children && (
          <button className='actionButton' style={nodeToggleButtonStyles} onClick={(e)=>{toggleNode();console.log('toggleNode', toggleNode, 'node', nodeDatum)}}>
            {nodeDatum.__rd3t.collapsed ? <span style={nodeExpandIconStyles} >&#187;</span> : <span style={nodeCollapseIconStyles}>&#187;</span> }
          </button>
        )}
      </div>
    </foreignObject>
  </g>
);

function updateTreeData(origin,list, key, children, targetNode) {
  console.log('origin', origin)
  console.log('list', list)
  console.log('key', key)
  console.log('children', children)
  return list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }

    if (node.children) {
      return { ...node, children: updateTreeData(targetNode, node.children, key, children) };
    }
    console.log('node', node)
    return node;
  });
}


function App() {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -(nodeSize.x-(nodeSize.x/2)) };
  const [loading, setLoading] = useState(false)
  const [testJson, setTestJson] = useState(
    {
      "key": '0',
      "name": "CEO",
      "children": [
        {
          "key": '0-0',
          "name": "Manager"
        },
        {
          "key": '0-1',
          "name": "Manager"
        }
      ]
    }
  )


  const onLoadData = (key, children, targetNode) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setLoading(true)
      setTimeout(() => {
        setTestJson((origin) => {
          let tree = updateTreeData(origin,origin.children, key, [
            {
              name: 'Child Node',
              key: `${origin.key}-${key}-0`
            },
            {
              name: 'Child Node',
              key: `${origin.key}-${key}-1`
            },
          ], targetNode)
          console.log('tree', tree)
          return {...origin, children: tree}
        }
          
        );
        setLoading(false)
        resolve();
      }, 1000);
    });

    const addChildren = (data) => {
      console.log('data) => ', data)
      console.log('test) => ', testJson)
      onLoadData(data.key, data?.children, data)
    }

  return (
    <div style={containerStyles} ref={containerRef}>
      {
        loading ? <label>Loading...</label> : ''
      }
      {/* <button onClick={()=>console.log('testJson', testJson)}>check json</button> */}
      <Tree
        data={testJson}
        // data={orgChartJson}
        translate={translate}
        nodeSize={nodeSize}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps, addChildren, loading })
        }
        orientation="vertical"
        svgClassName='customOrgTreeChart'
      />
    </div>
  );
}

export default App;