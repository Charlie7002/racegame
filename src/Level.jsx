import React, { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Float, Text } from '@react-three/drei'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({
	color: 'limegreen',
})

const floor2Material = new THREE.MeshStandardMaterial({
	color: 'greenYellow',
})

const obstacleMaterial = new THREE.MeshStandardMaterial({
	color: 'orangered',
})

const wallMaterial = new THREE.MeshStandardMaterial({
	color: 'slategrey',
})

const BlockStart = ({ position = [0, 0, 0] }) => (
	<group position={position}>
		<Float floatIntensity={0.25} rotationIntensity={0.25}>
			<Text
				font="./bebas-neue-v9-latin-regular.woff"
				scale={0.45}
				maxWidth={0.35}
				lineHeight={0.75}
				textAlign="right"
				position={[0.75, 0.75, 0]}
				rotation-y={-0.25}
			>
				Race Game 2024
				<meshBasicMaterial toneMapped={false} />
			</Text>
		</Float>
		{/* //floor */}
		<mesh
			geometry={boxGeometry}
			material={floor1Material}
			position={[0, 0.1, 0]}
			scale={[4, 0.2, 4]}
			receiveShadow
		/>
	</group>
)

const BlockEnd = ({ position = [0, 0, 0] }) => {
	const hamburger = useGLTF('./hamburger.glb')
	hamburger.scene.children.forEach(child => {
		child.castShadow = true
		child.receiveShadow = true
	})
	return (
		<group position={position}>
			<Float floatIntensity={0.25} rotationIntensity={0.25}>
				<Text
					font="./bebas-neue-v9-latin-regular.woff"
					scale={1}
					maxWidth={0.35}
					position={[0, 2.25, 2]}
					rotation-y={-0.25}
				>
					FINISH
					<meshBasicMaterial toneMapped={false} />
				</Text>
			</Float>
			{/* //floor */}
			<mesh
				geometry={boxGeometry}
				material={floor1Material}
				position={[0, 0.2, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>
			<RigidBody
				type="fixed"
				colliders="hull"
				restitution={0.2}
				position={[0, 0.35, 0]}
				friction={0}
			>
				<primitive object={hamburger.scene} scale={0.2} />
			</RigidBody>
		</group>
	)
}

export const BlockSpinner = ({ position = [0, 0, 0] }) => {
	const [speed] = useState(() =>
		(Math.random() + 0.2) * Math.random() < 0.5 ? -1 : 1,
	)
	useFrame(state => {
		const time = state.clock.getElapsedTime()
		const rotation = new THREE.Quaternion()
		rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
		obstacle.current.setNextKinematicRotation(rotation)
	})
	const obstacle = useRef()
	return (
		<group position={position}>
			{/* //floor */}
			<mesh
				geometry={boxGeometry}
				material={floor2Material}
				position={[0, 0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>
			{/* //barre */}
			<RigidBody
				type="kinematicPosition"
				position={[0, 0.3, 0]}
				restitution={0.2}
				friction={0}
				ref={obstacle}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					scale={[0.3, 0.3, 3]}
					castShadow
					receiveShadow
				/>
			</RigidBody>
		</group>
	)
}

export const BlockLimbo = ({ position = [0, 0, 0] }) => {
	const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
	useFrame(state => {
		const time = state.clock.getElapsedTime()
		const y = Math.sin(time * timeOffset) + 1.4
		obstacle.current.setNextKinematicTranslation({
			x: position[0],
			y: position[1] + y,
			z: position[2],
		})
	})
	const obstacle = useRef()
	return (
		<group position={position}>
			{/* //floor */}
			<mesh
				geometry={boxGeometry}
				material={floor2Material}
				position={[0, 0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>
			{/* //barre */}
			<RigidBody
				type="kinematicPosition"
				position={[0, 5, 0]}
				rotation={[0, Math.PI / 2, 0]}
				restitution={0.2}
				friction={0}
				ref={obstacle}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					scale={[0.3, 0.3, 3]}
					castShadow
					receiveShadow
				/>
			</RigidBody>
		</group>
	)
}

export const BlockAxe = ({ position = [0, 0, 0] }) => {
	const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
	useFrame(state => {
		const time = state.clock.getElapsedTime()
		const x = Math.sin(time * timeOffset) * 1.25
		obstacle.current.setNextKinematicTranslation({
			x: position[0] + x,
			y: position[1] + 1,
			z: position[2],
		})
	})
	const obstacle = useRef()
	return (
		<group position={position}>
			{/* //floor */}
			<mesh
				geometry={boxGeometry}
				material={floor2Material}
				position={[0, 0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>
			{/* //barre */}
			<RigidBody
				type="kinematicPosition"
				position={[0, 0, 0]}
				restitution={0.2}
				friction={0}
				ref={obstacle}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					scale={[1.5, 1.5, 0.3]}
					castShadow
					receiveShadow
				/>
			</RigidBody>
		</group>
	)
}

export const Bounds = ({ length = 1 }) => {
	return (
		<RigidBody type="fixed" restitution={0.2} friction={0}>
			<mesh
				geometry={boxGeometry}
				material={wallMaterial}
				position={[2.15, 0.75, -(length * 2) + 2]}
				scale={[0.3, 1.5, 4 * length]}
				castShadow
			/>
			<mesh
				geometry={boxGeometry}
				material={wallMaterial}
				position={[-2.15, 0.75, -(length * 2) + 2]}
				scale={[0.3, 1.5, 4 * length]}
				receiveShadow
			/>
			<mesh
				position={[0, 0.75, -(length * 4) + 2]}
				geometry={boxGeometry}
				material={wallMaterial}
				scale={[4, 1.5, 0.3]}
				receiveShadow
			/>
			<CuboidCollider
				args={[2, 0.1, 2 * length]}
				position={[0, 0.1, -(length * 2) + 2]}
				restitution={0.2}
				friction={1}
			/>
		</RigidBody>
	)
}

const Level = ({
	count = 5,
	types = [BlockSpinner, BlockLimbo, BlockAxe],
	seed = 0,
}) => {
	console.log(seed)
	const blocks = useMemo(() => {
		const blocks = []
		for (let i = 0; i < count; i++) {
			const type = types[Math.floor(Math.random() * types.length)]
			blocks.push(type)
		}
		return blocks
	}, [count, types, seed])

	return (
		<>
			<BlockStart position={[0, 0, 0]} />

			{blocks.map((Block, index) => (
				<Block key={index} position={[0, 0, -(index + 1) * 4]} />
			))}
			<BlockEnd position={[0, 0, -(count + 1) * 4]} />
			<Bounds length={count + 2} />
		</>
	)
}

export default Level
