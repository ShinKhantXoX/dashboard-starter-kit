import {Divider, Group, NavLink, Navbar, ScrollArea, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { navList } from "./DefaultNavList";
import { IconCircle0Filled } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";

export const DefaultNavigation = () => {
  
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const drawer = useSelector(state => state.drawer);
  console.log(drawer);
  
    return(
        <>
          {
            drawer ? null : (
              <Navbar 
          p={10}
          width={{base: 250}}
          fixed={true} 
          position={{ top: 0, left: 0 }}
        >
          <Navbar.Section>
            <Group className="group-row between relative" pb={10}>
              <Text> Application Menu </Text>
            </Group>
            
            <Divider />
          </Navbar.Section>

          <Navbar.Section grow component={ScrollArea}>
            { navList && navList.map((value, index) => {
              return(
                <NavLink 
                  key={index}
                  label={value.label}
                  icon={value.icon}
                  childrenOffset={28}
                  onClick={() => {
                    if(value.url) {
                      navigate(value.url)
                    }
                  }}
                >
                  {value.children.length > 0 && value.children.map((childValue, childIndex) => {
                    return (
                      <NavLink 
                        key={`${index}_${childIndex}`} 
                        label={childValue.label} 
                        icon={<IconCircle0Filled size={10} />}
                        onClick={() => {
                          if(childValue.url) {
                            navigate(childValue.url)
                          }
                        }}
                      />
                    )
                  })}
                </NavLink>
              )
            })}
          </Navbar.Section>
        </Navbar>
            )
          }
        </>
    )
}