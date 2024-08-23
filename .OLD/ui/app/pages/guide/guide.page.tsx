import React from 'react';
import Content from '../../shared/components/contentBox/content.component';
import ContentBox from '../../shared/components/contentBox/contentBox.component';
import { Link } from 'react-router-dom';

export default function GuidePage() {

    return (<Content>
            <ContentBox contentTitle={'Quick start'}>
                <p>Quick steps to set up your profile
                    <ol>
                        <li>
                            Go to <Link to={'/osc/avatars'}>saved avatars</Link> page and upload your avatars OSC file. This is not required but will make it
                            easier to select avatar parameters later.
                        </li>
                        <li>
                            Create an account on <Link to={'/website/connection'}>registration page</Link>. Use a registration key if you have one (it might be
                            required).
                        </li>
                        <li>Once you successfully registered, you can check and edit some basic <Link to={'/website/profile'}>profile information</Link>.</li>
                        <li>Now go to <Link to={'/website/avatars'}>website layout</Link> and add a new avatar.</li>
                        <li>
                            On the same page, go to the layout section and add a new layout. This is will be a group where you add buttons to. What you see on
                            this page is what will be displayed on your website profile.
                        </li>
                        <li>In your layout click on the plus icon to add buttons.</li>
                    </ol>
                </p>
                <p>Keep in mind there are limits on how many avatars, layouts and buttons you can have.</p>
                <p>I will try to add more detailed descriptions about what each section or setting does, look for a blueish questionmark icon on top right side of each
                    section</p>
            </ContentBox>
        </Content>
    );
}
