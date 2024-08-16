'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material'
import db from '../../../firebase'
import { collection, getDocs, doc } from 'firebase/firestore'

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const { id } = useParams()

  useEffect(() => {
    async function getFlashcard() {
      if (!id || !user) return

      const colRef = collection(doc(collection(db, 'users'), user.id), id)
      const docs = await getDocs(colRef)
      const flashcards = []
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })
      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [id, user])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box sx={{
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}>
                    <div style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      position: flipped[flashcard.id] ? 'absolute' : 'relative',
                    }}>
                      <Typography variant="h5" component="div">
                        {flashcard.front}
                      </Typography>
                    </div>
                    <div style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      position: flipped[flashcard.id] ? 'relative' : 'absolute',
                    }}>
                      <Typography variant="h5" component="div">
                        {flashcard.back}
                      </Typography>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
