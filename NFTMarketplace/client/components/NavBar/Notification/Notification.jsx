import React from 'react';
import Image from 'next/image';

import Style from './Notification.module.css';
import images from '../../../img';

const Notification = () => {
	return (
		<div className={Style.notificacion}>
			<p>Notificacion</p>
			<div className={Style.notificacion_box}>
				<div className={Style.notificacion_box_img}>
					<Image
						src={images.user1}
						alt='profile image'
						width={50}
						height={50}
						className={Style.notificacion_box_img}
					/>
				</div>
				<div className={Style.notificacion_box_info}>
					<h4>Ezequiel Angel</h4>
					<p>Measure action your user...</p>
					<small>3 minutes</small>
				</div>
				<span className={Style.notificacion_box_new}></span>
			</div>
		</div>
	);
};

export default Notification;
