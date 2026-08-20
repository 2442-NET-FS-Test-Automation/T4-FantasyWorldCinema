import { Flex } from "antd";
import "../CSS/Styles.css";
import "../CSS/Backgrounds.css";

export function Display404(){

    return (
        <Flex vertical className="Flex-Background" id="Display404" align="center" justify="center" style={{paddingTop: 18}}>

                <h1 className="Text404">404</h1>
                <h2 className="Text404">Not found</h2>
        </Flex>
    )
}