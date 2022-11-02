import React, { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';
import Species from '../../src/enums/Species';
import Gender from '../../src/enums/Gender';
import { Animal } from '../../src/types';
import useForm from '../../src/hooks/useForm';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PetsIcon from '@mui/icons-material/Pets';
import LoadingButton from '@mui/lab/LoadingButton';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Friendly from '../enums/Friendly';
import Playfulness from '../enums/Playfulness';
import  Modal  from '@mui/material/Modal';

const ModalFilter = ({
	id = 'modal',
	onClose = () => {},
	filter = (data: any) => {
		return data;
	},
	clearFilter = () => {},
	filtersSelected = {
		childrenFriendly: 0,
		petFriendly: 0,
		familyFriendly: 0,
		playfulness: 0,
		breed: {
			species: '',
		},
		species: '',
		gender: '',
	},
}) => {
 
	const schema = yup.object({
		gender: yup.string().oneOf(Object.values(Gender)) || undefined,
		breed: yup.object({
			id: yup.string(),
			name: yup.string(),
			species: yup.string().oneOf(Object.values(Species)) || undefined,
		}),
		species: yup.string() || undefined,
		playfulness: yup.number() || undefined,
		familyFriendly: yup.number(),
		petFriendly: yup.number() || undefined,
		childrenFriendly: yup.number() || undefined,
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
		getValues,
		trigger,
		watch,
	} = useForm<Animal>({
		// @ts-ignore
		schema,
		defaultValues: {
			gender: filtersSelected.gender
				? filtersSelected.gender === 'FEMALE'
					? Gender.Female
					: Gender.Male
				: undefined,
			breed: {
				species: filtersSelected.species
					? filtersSelected.species === 'CAT'
						? Species.Cat
						: Species.Dog
					: undefined,
			},
			familyFriendly: filtersSelected.familyFriendly
				? filtersSelected.familyFriendly === 1
					? Friendly.One
					: Friendly.Five
				: undefined,
			petFriendly: filtersSelected.petFriendly
				? filtersSelected.petFriendly === 1
					? Friendly.One
					: Friendly.Five
				: undefined,
			childrenFriendly: filtersSelected.childrenFriendly
				? filtersSelected.childrenFriendly === 1
					? Friendly.One
					: Friendly.Five
				: undefined,
			playfulness: filtersSelected.playfulness
				? filtersSelected.playfulness === 1
					? Playfulness.One
					: Playfulness.Five
				: undefined,
		},
	});
	const handleOutSideClick = (e: any) => {
		if (e.target.id === id) onClose();
	};

	return (
		<Grid
			id={id}
			className='modal'
			onClick={handleOutSideClick}
			zIndex={1300}
			style={{
 				width: '100%',
				height: '100vh',
				position: 'absolute',
				top: '0',
				left: '0',
				// display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				// overflow: 'auto',
				display: 'table',
				backgroundColor: 'rgba(0,0,0,0.8)',
			}}
		>
			<Container
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '30%',
				}}
			>
				<Box
					paddingY={3}
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Grid
						container
						justifyContent='center'
						alignContent='center'
						spacing={2}
						style={{
							width: '10   0%',
						}}
					>
						<Grid item>
							<Card>
								<CardContent>
									<form
										onSubmit={handleSubmit((data) => {
											filter(data);
										})}
									>
										<Grid container spacing={2} justifyContent='center'>
											<Grid item xs={12} textAlign='center'>
												<PetsIcon fontSize='large' color='primary' />
												<h3>Filtrar</h3>
											</Grid>
											<Grid item xs={12}>
												<FormControl>
													<FormLabel id='speciesLabel'>Espécie</FormLabel>
													<Controller
														name='breed.species'
														control={control}
														render={({ field }) => (
															<RadioGroup
																{...field}
																value={
																	getValues('breed.species') ??
																	filtersSelected.species ??
																	''
																}
																onChange={async (...event) => {
																	field.onChange(...event);

																	setValue('breed', {
																		id: '',
																		name: '',
																		species: event[0].target.value as Species,
																		createdAt: null,
																		createdAtISO: '',
																		updatedAt: null,
																		updatedAtISO: '',
																	});

																	await trigger('breed');
																}}
																aria-labelledby='speciesLabel'
															>
																<FormControlLabel
																	value={Species.Cat}
																	control={<Radio />}
																	label='Gato'
																/>
																<FormControlLabel
																	value={Species.Dog}
																	control={<Radio />}
																	label='Cachorro'
																/>
															</RadioGroup>
														)}
													/>
												</FormControl>
											</Grid>
											<Grid item xs={12}>
												<FormControl>
													<FormLabel id='genderLabel'>Sexo</FormLabel>
													<Controller
														name='gender'
														control={control}
														render={({ field }) => (
															<RadioGroup
																{...field}
																aria-labelledby='speciesLabel'
																value={
																	getValues('gender') ??
																	filtersSelected.gender ??
																	''
																}
															>
																<FormControlLabel
																	value={Gender.Female}
																	control={<Radio />}
																	label='Fêmea'
																/>
																<FormControlLabel
																	value={Gender.Male}
																	control={<Radio />}
																	label='Macho'
																/>
															</RadioGroup>
														)}
													/>
												</FormControl>
											</Grid>
											<Grid item xs={12}>
												<FormControl>
													<FormLabel id='playfulnessLabel'>
														Brincadeiras
													</FormLabel>
													<Controller
														name='playfulness'
														control={control}
														render={({ field }) => (
															<RadioGroup
																{...field}
																aria-labelledby='playfulnessLabel'
																value={
																	getValues('playfulness') ??
																	filtersSelected.playfulness ??
																	''
																}
															>
																<FormControlLabel
																	value={5}
																	control={<Radio />}
																	style={{ marginTop: '2%' }}
																	label='Brincalhão'
																/>

																<FormControlLabel
																	value={1}
																	control={<Radio />}
																	style={{ marginTop: '2%' }}
																	label='Calmo'
																/>
															</RadioGroup>
														)}
													/>
												</FormControl>
											</Grid>
											<Grid item xs={12}>
												<FormControl>
													<FormLabel id='familyFriendlyLabel'>
														Amigavel com a familia
													</FormLabel>
													<Controller
														name='familyFriendly'
														control={control}
														render={({ field }) => (
															<RadioGroup
																{...field}
																aria-labelledby='familyFriendlyLabel'
																value={
																	getValues('familyFriendly') ??
																	filtersSelected.familyFriendly ??
																	''
																}
															>
																<FormControlLabel
																	value={5}
																	control={<Radio />}
																	label='Carinhoso'
																/>
																<FormControlLabel
																	value={1}
																	control={<Radio />}
																	label='Envergonhado'
																/>
															</RadioGroup>
														)}
													/>
												</FormControl>
											</Grid>
											<Grid item xs={12}>
												<FormControl>
													<FormLabel id='petFriendlyLabel'>
														Amigavel com animais
													</FormLabel>
													<Controller
														name='petFriendly'
														control={control}
														render={({ field }) => (
															<RadioGroup
																{...field}
																aria-labelledby='speciesLabel'
																value={
																	getValues('petFriendly') ??
																	filtersSelected.petFriendly ??
																	''
																}
															>
																<FormControlLabel
																	value={5}
																	control={<Radio />}
																	label='Amigável Com Animais'
																/>

																<FormControlLabel
																	value={1}
																	control={<Radio />}
																	label='Prefere Ser o Único'
																/>
															</RadioGroup>
														)}
													/>
												</FormControl>
											</Grid>
											<Grid item xs={12}>
												<FormControl>
													<FormLabel id='childrenFriendlyLabel'>
														Amigavel com animais
													</FormLabel>
													<Controller
														name='childrenFriendly'
														control={control}
														render={({ field }) => (
															<RadioGroup
																{...field}
																aria-labelledby='childrenFriendlyLabel'
																value={
																	getValues('childrenFriendly') ??
																	filtersSelected.childrenFriendly ??
																	''
																}
															>
																<FormControlLabel
																	value={5}
																	control={<Radio />}
																	label='Amigável Com Crianças'
																/>

																<FormControlLabel
																	value={1}
																	control={<Radio />}
																	label='Prefere Adultos'
																/>
															</RadioGroup>
														)}
													/>
												</FormControl>
											</Grid>
											<Grid
												item
												xs={12}
												style={{
													display: 'block',
												}}
											>
												<div
													style={{
														display: 'flex',
													}}
												>
													<LoadingButton
														fullWidth
														variant='contained'
														size='large'
														type='submit'
													>
														Filtrar
													</LoadingButton>
													<IconButton
														style={{
															borderRadius: '100%',
														}}
														onClick={() => {
															clearFilter();
															onClose();
														}}
													>
														<FilterAltOffIcon />
													</IconButton>
												</div>
											</Grid>
										</Grid>
									</form>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</Grid>
	);
};
export default ModalFilter;
