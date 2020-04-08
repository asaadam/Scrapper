import React from 'react';

export default function Card(props) {
    return (
        <div class="box">
            <article class="media">
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>{props.item.title}</strong> <small>{props.item.seller}</small> <small>{props.item.location}</small>
                            <br />
                            <h4>{props.item.price}</h4>
                     </p>
                    </div>
                  
                </div>
            </article>
        </div>
    )
}