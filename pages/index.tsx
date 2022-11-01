import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { NextPage } from 'next';
import Head from 'next/head';
import Container from '@mui/material/Container';
import { AnimalCard } from '../src/components/AnimalCard';
import useGetAnimalsQuery from '../src/hooks/queries/useGetAnimalsQuery';
import { ListHeader } from '../src/components/ListHeader';
import { useState } from 'react';
import { Animal, ChipData } from '../src/types';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import IconButton from '@mui/material/IconButton';
import ModalFilter from '../src/components/ModalFilter';
import Chip from '@mui/material/Chip';

const Home: NextPage = () => {
	const {
		data: animals,
		isLoading,
		isError,
		isFetched,
		isRefetching,
	} = useGetAnimalsQuery();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [filtersSelected, setFiltersSelected] = useState({
		childrenFriendly: 0,
		petFriendly: 0,
		familyFriendly: 0,
		playfulness: 0,
		breed: {
			species: '',
		},
		species: '',
		gender: '',
	});
	const [animaisMostrar, setAnimals] = useState(animals);
	const [currentFilters, setCurrentFilters] = useState({});
	function filtrarGender(
		animalsGender: Animal[] | undefined,
		gender: string
	): Animal[] {
		let currentAnimals: Animal[] = [];
		animalsGender?.forEach((animal) => {
			if (animal.gender === gender) {
				currentAnimals.push(animal);
			}
		});

		return currentAnimals;
	}
	function filtrarSpecie(
		animalsSpecie: Animal[] | undefined,
		specie: string
	): Animal[] {
		let currentAnimals: Animal[] = [];
		animalsSpecie?.forEach((animal) => {
			if (animal.breed.species === specie) {
				currentAnimals.push(animal);
			}
		});
		return currentAnimals;
	}
	function filtrarFamilyFriendly(
		animalsFamily: Animal[] | undefined,
		filter: number
	): Animal[] {
		let currentAnimals: Animal[] = [];
		animalsFamily?.forEach((animal) => {
			if (animal.familyFriendly >= 3 && filter === 5) {
				currentAnimals.push(animal);
			}
			if (animal.familyFriendly <= 3 && filter === 1) {
				currentAnimals.push(animal);
			}
		});
		return currentAnimals;
	}
	function filtrarChildrenFriendly(
		animalsChildren: Animal[] | undefined,
		filter: number
	): Animal[] {
		let currentAnimals: Animal[] = [];
		animalsChildren?.forEach((animal) => {
			if (animal.childrenFriendly >= 3 && filter === 5) {
				currentAnimals.push(animal);
			}
			if (animal.childrenFriendly <= 3 && filter === 1) {
				currentAnimals.push(animal);
			}
		});
		return currentAnimals;
	}
	function filtrarPetFriendly(
		animalsFriendly: Animal[] | undefined,
		filter: number
	): Animal[] {
		let currentAnimals: Animal[] = [];
		animalsFriendly?.forEach((animal) => {
			if (animal.petFriendly >= 3 && filter === 5) {
				currentAnimals.push(animal);
			}
			if (animal.petFriendly <= 3 && filter === 1) {
				currentAnimals.push(animal);
			}
		});
		return currentAnimals;
	}
	function filtrarPlayfulness(
		animalsPlayfulness: Animal[] | undefined,
		filter: number
	): Animal[] {
		let currentAnimals: Animal[] = [];
		animalsPlayfulness?.forEach((animal) => {
			if (animal.playfulness >= 3 && filter === 5) {
				currentAnimals.push(animal);
			}
			if (animal.playfulness <= 3 && filter === 1) {
				currentAnimals.push(animal);
			}
		});
		return currentAnimals;
	}

	function Filtrar(value: any) {
		let currentAnimals = animals;
		let chips: ChipData[] = [];
		setCurrentFilters(value);
		value.species = value.breed.species || value.species;
		setFiltersSelected(value);
		if (value.gender) {
			currentAnimals = filtrarGender(currentAnimals, value.gender);
			if (value.gender === 'MALE') {
				chips.push({ key: 'gender', label: 'Macho' });
			} else {
				chips.push({ key: 'gender', label: 'Fêmea' });
			}
		}
		if (value.breed.species) {
			currentAnimals = filtrarSpecie(currentAnimals, value.breed.species);
			if (value.breed.species === 'DOG') {
				chips.push({ key: 'species', label: 'Cachorro' });
			} else {
				chips.push({ key: 'species', label: 'Gato' });
			}
		}
		if (value.familyFriendly) {
			currentAnimals = filtrarFamilyFriendly(
				currentAnimals,
				value.familyFriendly
			);
			if (value.familyFriendly === 5) {
				chips.push({ key: 'familyFriendly', label: 'Carinhoso' });
			} else {
				chips.push({ key: 'familyFriendly', label: 'Envergonhado' });
			}
		}
		if (value.childrenFriendly) {
			currentAnimals = filtrarChildrenFriendly(
				currentAnimals,
				value.childrenFriendly
			);
			if (value.childrenFriendly === 5) {
				chips.push({ key: 'childrenFriendly', label: 'Amigável Com Crianças' });
			} else {
				chips.push({ key: 'childrenFriendly', label: 'Prefere Adultos' });
			}
		}
		if (value.petFriendly) {
			currentAnimals = filtrarPetFriendly(currentAnimals, value.petFriendly);
			if (value.petFriendly === 5) {
				chips.push({ key: 'petFriendly', label: 'Amigável Com Animais' });
			} else {
				chips.push({ key: 'petFriendly', label: 'Prefere Ser o Único' });
			}
		}
		if (value.playfulness) {
			currentAnimals = filtrarPlayfulness(currentAnimals, value.playfulness);
			if (value.playfulness === 5) {
				chips.push({ key: 'playfulness', label: 'Brincalhão' });
			} else {
				chips.push({ key: 'playfulness', label: 'Calmo' });
			}
		}
		setAnimals(currentAnimals);

		setChipData(chips);
	}
	function limparFiltro() {
		setChipData([]);
		setAnimals(animals);
		setFiltersSelected({
			childrenFriendly: 0,
			petFriendly: 0,
			familyFriendly: 0,
			playfulness: 0,
			breed: {
				species: '',
			},
			species: '',
			gender: '',
		});
	}

	const [chipData, setChipData] = useState<readonly ChipData[]>([]);

	const handleDelete = (chipToDelete: ChipData) => () => {
		let filters = { ...filtersSelected, [chipToDelete.key]: undefined };
		if (chipToDelete.key === 'species') {
			filters.breed.species = '';
		}
		setFiltersSelected(filters);
		Filtrar(filters);
		setChipData((chips) =>
			chips.filter((chip) => chip.key !== chipToDelete.key)
		);
	};

	return (
		<>
			<Head>
				<title>MiAudote - Doações</title>
			</Head>
			<Container maxWidth='xl'>
				<Grid container spacing={2} sx={{ marginY: 2 }} flexDirection='column'>
					<Grid>
						<Grid item xs={12} display='flex' alignItems='center'>
							<ListHeader label='Doações' loading={isLoading || isRefetching} />
							<IconButton
								style={{
									borderRadius: '100%',
								}}
								onClick={() => {
									setIsModalVisible(true);
								}}
							>
								<FilterAltIcon />
							</IconButton>
						</Grid>
						<Grid display='flex' alignItems='center'>
							{chipData.map((data) => {
								let icon;

								return (
									<Grid key={data.key}>
										<Chip
											icon={icon}
											label={data.label}
											onDelete={handleDelete(data)}
										/>
									</Grid>
								);
							})}
						</Grid>
					</Grid>
					<Grid display='flex'>
						{isError && 'ERRO'}
						{isFetched && animaisMostrar?.length === 0 && (
							<Grid item xs={12} textAlign='center'>
								<SentimentDissatisfiedIcon fontSize='large' />
								<Typography variant='h4' color='white'>
									Nenhuma doação disponível
								</Typography>
							</Grid>
						)}
						{isFetched &&
							animaisMostrar?.map((animal) => (
								<Grid
									item
									key={animal.name}
									xs={12}
									sm={6}
									md={4}
									lg={3}
									paddingRight='2%'
									paddingTop='2%'
								>
									<AnimalCard animal={animal} />
								</Grid>
							))}
						{isFetched && !animaisMostrar && animals?.length === 0 && (
							<Grid item xs={12} textAlign='center'>
								<SentimentDissatisfiedIcon fontSize='large' />
								<Typography variant='h4' color='white'>
									Nenhuma doação disponível
								</Typography>
							</Grid>
						)}
						{isFetched &&
							!animaisMostrar &&
							animals?.map((animal) => (
								<Grid
									item
									key={animal.name}
									xs={12}
									sm={6}
									md={4}
									lg={3}
									paddingRight='2%'
									paddingTop='2%'
								>
									<AnimalCard animal={animal} />
								</Grid>
							))}
					</Grid>
				</Grid>
			</Container>
			{isModalVisible ? (
				<ModalFilter
					onClose={() => {
						setIsModalVisible(false);
					}}
					filter={(data) => {
						Filtrar(data);
						setIsModalVisible(false);
						setCurrentFilters(data);
					}}
					clearFilter={() => {
						limparFiltro();
					}}
					filtersSelected={filtersSelected}
				/>
			) : null}
		</>
	);
};
export default Home;
