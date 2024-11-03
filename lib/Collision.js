export function Collision(a, b)
{
    // actualiza los calculos de los bordes left, right, up y down
    a.updateBorder();
    b.updateBorder();

    // Calcula la superposición en cada eje
    const overlapX = Math.min(a.borderRight - b.position.x, b.borderRight - a.position.x);
    const overlapY = Math.min(a.borderDown - b.position.y, b.borderDown - a.position.y);

    // colision Trigger
    if (a.type === "Trigger")
    {
        if (a.bodyEnter(b))
        {
            if (!b.trigger) // Solo ejecuta si b no está ya en estado trigger
            {
                b.trigger = true;
                if (a.parent.is_trigger_enter !== undefined) a.parent.is_trigger_enter(b.parent);
            }
        } else if (b.trigger)
        {
            if (a.parent.is_trigger_exit !== undefined) a.parent.is_trigger_exit(b.parent);
            b.trigger = false;
        }
    } 
    // colision solida
    if (a.type === "CharacterBody" && b.type === "Static" ) 
    {
        if (a.bodyEnter(b)) 
        {
            
            b.collisionStatic = true;
            // Asegurarse de que la corrección respete el eje principal del objeto más largo
            if (overlapX  < overlapY ) 
            {
                // Corrección horizontal
                if (a.position.x < b.position.x) 
                {
                    if (a.borderRight > b.position.x + 2) a.parent.position.x -= 1;
                    a.parent.velocity.x = 0;
                    a.parent.slice_right = false;
                    a.parent.isWall = true;
                } 
                else 
                {
                    if (a.position.x < b.borderRight - 2) a.parent.position.x += 1;
                    a.parent.velocity.x = 0;
                    a.parent.slice_left = false;
                    a.parent.isWall = true;
                }
            } 
            else 
            {
                // Corrección vertical
                if (a.position.y < b.position.y ) 
                {
                    if (a.parent.restitution > 0 ) 
                    {
                        a.parent.position.y = a.parent.position.y - a.parent.restitution;
                        a.parent.restitution -= 1;
                    } else if (a.borderDown > b.position.y + 2) a.parent.position.y -= 2;
                    a.parent.velocity.y = 0;
                    a.parent.slice_down = false;
                    a.parent.isFloor = true;
                    

                } 
                else 
                {
                    if (a.position.y < b.borderDown - 2) a.parent.position.y += 1;
                    a.parent.velocity.y = 0;
                    a.parent.slice_up = false;
                    a.parent.isCeiling = true;
                }
            }
            
            
        } else if (b.collisionStatic)
        {
            // Resetea los flags de colisión
            a.parent.slice_right = true;
            a.parent.slice_left = true;
            a.parent.slice_down = true;
            a.parent.slice_up = true;
            a.parent.isFloor = false;
            a.parent.isWall = false;
            a.parent.isCeiling = false;
            b.collisionStatic = false;
        }
    } 
    // colision Plataforma
    if (a.type === "CharacterBody" && b.type === "Plataform" ) 
    {
        if (a.bodyEnter(b)) 
        {

            b.collisionPlataform = true;
            // Asegurarse de que la corrección respete el eje principal del objeto más largo
            if (overlapX  < overlapY ) 
            {
                // Corrección horizontal
                if (a.position.x < b.position.x) 
                {
                    if (a.borderRight > b.position.x + 2) a.parent.position.x -= 1;
                    a.parent.velocity.x = 0;
                    a.parent.slice_right = false;
                    a.parent.isWall = true;
                } 
                else 
                {
                    if (a.position.x < b.borderRight - 2) a.parent.position.x += 1;
                    a.parent.velocity.x = 0;
                    a.parent.slice_left = false;
                    a.parent.isWall = true;
                }
            } 
            else 
            {
                // Corrección vertical
                if (a.borderDown < b.position.y + (b.scale.y / 2) && a.parent.velocity.y > 0) 
                {
                    a.parent.velocity.y = 0;
                    a.parent.slice_down = false;
                    a.parent.isFloor = true;
                } 
                
            }
            
            
        } else if (b.collisionPlataform)
        {
            // Resetea los flags de colisión
            a.parent.slice_right = true;
            a.parent.slice_left = true;
            a.parent.slice_down = true;
            a.parent.slice_up = true;
            a.parent.isFloor = false;
            a.parent.isWall = false;
            b.collisionPlataform = false;
        }
    }
    // colision CharacterBody
    if (a.type === "CharacterBody" && b.type === "RigidBody" ) 
    {
        if (a.bodyEnter(b)) 
        {
            b.collisionRigidBody = true;
            // Asegurarse de que la corrección respete el eje principal del objeto más largo
            if (overlapX  < overlapY ) 
            {
                // Corrección horizontal
                if (a.position.x < b.position.x) 
                {
                    a.parent.slice_right = false;
                    b.parent.friction = 0.9;
                    b.parent.velocity.x = (b.parent.velocity.x + Math.abs(a.parent.velocity.x / 4)) * b.parent.friction;
                    a.parent.isWall = true;
                } 
                else 
                {
                    a.parent.slice_left = false;
                    b.parent.friction = 0.9;
                    b.parent.velocity.x = (b.parent.velocity.x - Math.abs(a.parent.velocity.x / 4)) * b.parent.friction;
                    a.parent.isWall = true;
                }
            } 
            else 
            {
                // Corrección vertical
                if (a.position.y < b.position.y ) 
                {
                    if (a.borderDown > b.position.y + 2) a.parent.position.y -= a.parent.restitution;
                    a.parent.velocity.y = 0;
                    a.parent.slice_down = false;
                    a.parent.isFloor = true;
                } 
                else 
                {
                    if (a.position.y < b.borderDown - 2) a.parent.position.y += 1;
                    a.parent.velocity.y = 0;
                    a.parent.slice_up = false;
                    a.parent.isCeiling = true;
                }
                
            }
            
            
        } else if (b.collisionRigidBody)
        {
            // Resetea los flags de colisión
            a.parent.slice_right = true;
            a.parent.slice_left = true;
            a.parent.slice_down = true;
            a.parent.slice_up = true;
            a.parent.isFloor = false;
            a.parent.isWall = false;
            a.parent.isCeiling = false;
            b.collisionRigidBody = false;
        }
    }
    // colision statica con  rigidBody
    if (a.type === "RigidBody" && b.type === "Static") 
    {
        if (a.bodyEnter(b)) 
        {
            b.rigidBody = true;
            // Asegurarse de que la corrección respete el eje principal del objeto más largo
            if (overlapX  < overlapY ) 
            {
                // Corrección horizontal
                if (a.position.x < b.position.x) 
                {
                    if (a.borderRight > b.position.x + 2) a.parent.position.x -= 1;
                    a.parent.velocity.x = 0;
                    a.parent.slice_right = false;
                    a.parent.isWall = true;
                } 
                else 
                {
                    if (a.position.x < b.borderRight - 2) a.parent.position.x += 1;
                    a.parent.velocity.x = 0;
                    a.parent.slice_left = false;
                    a.parent.isWall = true;
                }
            } 
            else 
            {
                // Corrección vertical
                if (a.position.y < b.position.y ) 
                {
                    if (a.borderDown > b.position.y + 2) a.parent.position.y -= a.parent.restitution;
                    a.parent.velocity.y = 0;
                    a.parent.slice_down = false;
                    a.parent.isFloor = true;
                } 
                else 
                {
                    if (a.position.y < b.borderDown - 2) a.parent.position.y += 1;
                    a.parent.velocity.y = 0;
                    a.parent.slice_up = false;
                    a.parent.isCeiling = true;
                }
            }
            
            
        } else if (b.rigidBody)
        {
            // Resetea los flags de colisión
            a.parent.slice_right = true;
            a.parent.slice_left = true;
            a.parent.slice_down = true;
            a.parent.slice_up = true;
            a.parent.isFloor = false;
            a.parent.isWall = false;
            a.parent.isCeiling = false;
            b.rigidBody = false;
        }
    } 
    // colision rigiBody con plataforma
    if (a.type === "RigidBody" && b.type === "Plataform" ) 
    {
        if (a.bodyEnter(b)) 
        {
            b.plataform = true;
            // Asegurarse de que la corrección respete el eje principal del objeto más largo
            if (overlapX  < overlapY ) 
            {
                // Corrección horizontal
                if (a.position.x < b.position.x) 
                {
                    if (a.borderRight > b.position.x + 2) a.parent.position.x -= 1;
                    a.parent.velocity.x = 0;
                    a.parent.slice_right = false;
                    a.parent.isWall = true;
                } 
                else 
                {
                    if (a.position.x < b.borderRight - 2) a.parent.position.x += 1;
                    a.parent.velocity.x = 0;
                    a.parent.slice_left = false;
                    a.parent.isWall = true;
                }
            } 
            else 
            {
                // Corrección vertical
                if (a.borderDown < b.position.y + (b.scale.y / 2) && a.parent.velocity.y > 0) 
                {
                    a.parent.velocity.y = 0;
                    a.parent.slice_down = false;
                    a.parent.isFloor = true;
                } 
                
            }
            
            
        } else if (b.plataform)
        {
            // Resetea los flags de colisión
            a.parent.slice_right = true;
            a.parent.slice_left = true;
            a.parent.slice_down = true;
            a.parent.slice_up = true;
            a.parent.isFloor = false;
            a.parent.isWall = false;
            b.plataform = false;
        }
    }

}